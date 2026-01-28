import db from '../models'
import bcrypt from 'bcryptjs'
import { v4 } from 'uuid'
import chothuematbang from '../../data/chothuematbang.json'
import chothuecanho from '../../data/chothuecanho.json'
import nhachothue from '../../data/nhachothue.json'
import chothuephongtro from '../../data/chothuephongtro.json'
import generateCode from '../utils/generateCode'
import { dataPrice, dataArea } from '../utils/data'
import { getNumberFromString, getNumberFromStringV2 } from '../utils/common'
import { sequelize } from '../models'
require('dotenv').config()
const dataBody = [
    {
        body: chothuephongtro.body,
        code: 'CTPT',
        value: 'Cho thuê phòng trọ',
        header: chothuephongtro.header.title,
        description: chothuephongtro.header.description
    },
    {
        body: chothuematbang.body,
        code: 'CTMB',
        value: 'Cho thuê mặt bằng',
        header: chothuematbang.header.title,
        description: chothuematbang.header.description
    },
    {
        body: chothuecanho.body,
        code: 'CTCH',
        value: 'Cho thuê căn hộ',
        header: chothuecanho.header.title,
        description: chothuecanho.header.description
    },
    {
        body: nhachothue.body,
        code: 'NCT',
        value: 'Nhà cho thuê',
        header: nhachothue.header.title,
        description: nhachothue.header.description
    },
]


const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(12))

// Helper function to parse date string
const parseDate = (dateString) => {
    if (!dateString || dateString === 'Invalid date') return null
    
    try {
        // Try parsing Vietnamese date format: "Thứ 2, 10:30 20/01/2026" or "20/01/2026"
        const dateMatch = dateString.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
        if (dateMatch) {
            const [, day, month, year] = dateMatch
            const date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`)
            return isNaN(date.getTime()) ? null : date
        }
        
        // Try standard date parsing
        const date = new Date(dateString)
        return isNaN(date.getTime()) ? null : date
    } catch (error) {
        return null
    }
}

export const insertService = () => new Promise(async (resolve, reject) => {
    const transaction = await sequelize.transaction()
    
    try {
        const provinceCodes = []
        const labelCodes = []
        const userPhones = []
        
        // Collect all unique province, label and user info
        dataBody.forEach(cate => {
            cate.body.forEach((item) => {
                let labelCode = generateCode(item?.header?.class?.classType).trim()
                if (labelCodes.every(item => item?.code !== labelCode)) {
                    labelCodes.push({
                        code: labelCode,
                        value: item?.header?.class?.classType?.trim()
                    })
                }
                
                let provinceCode = generateCode(item?.header?.address?.split(',')?.slice(-1)[0]).trim()
                if (provinceCodes.every(item => item?.code !== provinceCode)) {
                    provinceCodes.push({
                        code: provinceCode,
                        value: item?.header?.address?.split(',')?.slice(-1)[0].trim()
                    })
                }

                let phone = item?.contact?.content.find(i => i.name === "Điện thoại:")?.content?.trim()
                if (phone && userPhones.every(u => u.phone !== phone)) {
                    userPhones.push({
                        id: v4(),
                        phone,
                        name: item?.contact?.content.find(i => i.name === "Liên hệ:")?.content?.trim(),
                        zalo: item?.contact?.content.find(i => i.name === "Zalo")?.content?.trim(),
                        fbUrl: item?.contact?.content.find(i => i.name === "Facebook")?.content?.trim(),
                        password: hashPassword('123456')
                    })
                }
            })
        })
        
        // Insert provinces, labels and categories
        await Promise.all([
            ...provinceCodes.map(item => 
                db.Province.findOrCreate({
                    where: { code: item.code },
                    defaults: item,
                    transaction
                })
            ),
            ...labelCodes.map(item => 
                db.Label.findOrCreate({
                    where: { code: item.code },
                    defaults: item,
                    transaction
                })
            ),
            ...dataBody.map(cate => 
                db.Category.findOrCreate({
                    where: { code: cate.code },
                    defaults: {
                        code: cate.code,
                        value: cate.value,
                        header: cate.header,
                        subheader: cate.description
                    },
                    transaction
                })
            )
        ])
        
        // Insert unique users and create a phone -> id mapping
        const usersResult = await Promise.all(userPhones.map(item => 
            db.User.findOrCreate({
                where: { phone: item.phone },
                defaults: item,
                transaction
            })
        ))

        const userMapping = usersResult.reduce((acc, [user]) => {
            acc[user.phone] = user.id
            return acc
        }, {})
        
        // Insert all posts with related data
        const insertPromises = dataBody.flatMap(cate => 
            cate.body.map(async (item) => {
                const postId = v4()
                const labelCode = generateCode(item?.header?.class?.classType).trim()
                const provinceCode = generateCode(item?.header?.address?.split(',')?.slice(-1)[0]).trim()
                const attributesId = v4()
                const imagesId = v4()
                const overviewId = v4()
                const phone = item?.contact?.content.find(i => i.name === "Điện thoại:")?.content?.trim()
                const userId = userMapping[phone]
                
                const desc = JSON.stringify(item?.mainContent?.content)
                const currentArea = getNumberFromString(item?.header?.attributes?.acreage)
                const currentPrice = getNumberFromString(item?.header?.attributes?.price)
                
                // Parse dates
                const createdDate = parseDate(item?.overview?.content.find(i => i.name === "Ngày đăng:")?.content)
                const expiredDate = parseDate(item?.overview?.content.find(i => i.name === "Ngày hết hạn:")?.content)
                
                // Create all records in parallel
                return Promise.all([
                    db.Post.create({
                        id: postId,
                        title: item?.header?.title,
                        star: item?.header?.star,
                        labelCode,
                        address: item?.header?.address,
                        attributesId,
                        categoryCode: cate.code,
                        description: desc,
                        userId,
                        overviewId,
                        imagesId,
                        areaCode: dataArea.find(area => area.max > currentArea && area.min <= currentArea)?.code,
                        priceCode: dataPrice.find(area => area.max > currentPrice && area.min <= currentPrice)?.code,
                        provinceCode,
                        priceNumber: getNumberFromStringV2(item?.header?.attributes?.price),
                        areaNumber: getNumberFromStringV2(item?.header?.attributes?.acreage)
                    }, { transaction }),
                    
                    db.Attribute.create({
                        id: attributesId,
                        price: item?.header?.attributes?.price,
                        acreage: item?.header?.attributes?.acreage,
                        published: item?.header?.attributes?.published,
                        hashtag: item?.header?.attributes?.hashtag,
                    }, { transaction }),
                    
                    db.Image.create({
                        id: imagesId,
                        image: JSON.stringify(item?.images)
                    }, { transaction }),
                    
                    db.Overview.create({
                        id: overviewId,
                        code: item?.overview?.content.find(i => i.name === "Mã tin:")?.content,
                        area: item?.overview?.content.find(i => i.name === "Khu vực")?.content,
                        type: item?.overview?.content.find(i => i.name === "Loại tin rao:")?.content,
                        target: item?.overview?.content.find(i => i.name === "Đối tượng thuê:")?.content,
                        bonus: item?.overview?.content.find(i => i.name === "Gói tin:")?.content,
                        created: createdDate,
                        expired: expiredDate,
                    }, { transaction }),
                ])
            })
        )
        
        await Promise.all(insertPromises)
        
        // Commit transaction
        await transaction.commit()
        
        resolve('Done.')
    } catch (error) {
        // Rollback transaction on error
        await transaction.rollback()
        console.error('Insert error:', error)
        reject(error)
    }
})

export const createPricesAndAreas = () => new Promise(async (resolve, reject) => {
    const transaction = await sequelize.transaction()
    
    try {
        // Use Promise.all with map instead of forEach
        await Promise.all([
            ...dataPrice.map((item, index) => 
                db.Price.findOrCreate({
                    where: { code: item.code },
                    defaults: {
                        code: item.code,
                        value: item.value,
                        order: index + 1
                    },
                    transaction
                })
            ),
            ...dataArea.map((item, index) => 
                db.Area.findOrCreate({
                    where: { code: item.code },
                    defaults: {
                        code: item.code,
                        value: item.value,
                        order: index + 1
                    },
                    transaction
                })
            )
        ])
        
        await transaction.commit()
        resolve('OK')
    } catch (err) {
        await transaction.rollback()
        console.error('Create prices and areas error:', err)
        reject(err)
    }
})