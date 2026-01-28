import db from '../models'
import { v4 } from 'uuid'
import generateCode from '../utils/generateCode'
import moment from 'moment'
import generateDate from '../utils/generateDate'

const { Op } = require("sequelize");

export const getPostsService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Post.findAll({
            raw: true,
            nest: true,
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published', 'hashtag'] },
                { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone'] },
            ],
            attributes: ['id', 'title', 'star', 'address', 'description']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Getting posts is failed.',
            response
        })

    } catch (error) {
        reject(error)
    }
})
export const getPostsLimitService = (page, query, { priceNumber, areaNumber }) => new Promise(async (resolve, reject) => {
    try {
        let offset = (!page || +page <= 1) ? 0 : (+page - 1)
        const queries = {}
        
        // Handle regular query params
        Object.keys(query).forEach(key => {
            const value = query[key]
            if (Array.isArray(value)) {
                // If array, use Op.in
                queries[key] = { [Op.in]: value }
            } else {
                // Single value
                queries[key] = value
            }
        })
        
        // Handle price range
        if (priceNumber) {
            const priceArray = Array.isArray(priceNumber) ? priceNumber : [priceNumber]
            if (priceArray.length === 2) {
                queries.priceNumber = { [Op.between]: priceArray }
            } else if (priceArray.length === 1) {
                queries.priceNumber = priceArray[0]
            }
        }
        
        // Handle area range
        if (areaNumber) {
            const areaArray = Array.isArray(areaNumber) ? areaNumber : [areaNumber]
            if (areaArray.length === 2) {
                queries.areaNumber = { [Op.between]: areaArray }
            } else if (areaArray.length === 1) {
                queries.areaNumber = areaArray[0]
            }
        }
        
        const response = await db.Post.findAndCountAll({
            where: queries,
            raw: true,
            nest: true,
            offset: offset * +process.env.LIMIT,
            limit: +process.env.LIMIT,
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published', 'hashtag'] },
                { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone'] },
            ],
            attributes: ['id', 'title', 'star', 'address', 'description']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Getting posts is failed.',
            response
        })

    } catch (error) {
        reject(error)
    }
})

export const getNewPostService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Post.findAll({
            raw: true,
            nest: true,
            offset: 0,
            order: [['createdAt', 'DESC']],
            limit: +process.env.LIMIT,
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published', 'hashtag'] },
            ],
            attributes: ['id', 'title', 'star', 'createdAt']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Getting posts is failed.',
            response
        })

    } catch (error) {
        reject(error)
    }
})

export const getPostDetailService = (postId) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Post.findOne({
            where: { id: postId },
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published', 'hashtag'] },
                { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone', 'avatar'] },
                { model: db.Overview, as: 'overviews' },
            ],
        })

        if (!response) {
            resolve({
                err: 1,
                msg: 'Post not found'
            })
            return
        }

        resolve({
            err: 0,
            msg: 'OK',
            response
        })

    } catch (error) {
        reject(error)
    }
})

export const createNewPostService = (body, userId) => new Promise(async (resolve, reject) => {
    try {
        const attributesId = v4()
        const imagesId = v4()
        const overviewId = v4()
        const labelCode = generateCode(body.label)
        const hashtag = Math.floor(Math.random() * Math.pow(10, 6))
        const currentDate = generateDate();

        await db.Post.create({
            id: v4(),
            title: body.title,
            labelCode,
            address: body.address,
            attributesId,
            categoryCode: body.categoryCode,
            description: JSON.stringify(body.description),
            userId,
            overviewId,
            imagesId,
            areaCode: body.areaCode,
            priceCode: body.priceCode,
            provinceCode: generateCode(body.province),
            priceNumber: body.priceNumber / Math.pow(10, 6),
            areaNumber: body.areaNumber
        })
        await db.Attribute.create({
            id: attributesId,
            price: +body.priceNumber < 1000000 ? `${+body.priceNumber / 1000} nghìn/tháng` : `${+body.priceNumber / 1000000} triệu/tháng`,
            acreage: `${body.areaNumber} m2`,
            published: moment(new Date()).format('DD/MM/YYYY'),
            hashtag
        })
        await db.Image.create({
            id: imagesId,
            image: JSON.stringify(body.images)
        })
        await db.Overview.create({
            id: overviewId,
            code: `#${hashtag}`,
            area: body.address,
            type: body?.categoryName,
            target: body?.target,
            bonus: 'Tin thường',
            created: currentDate.today,
            expired: currentDate.expireDay,
        })
        resolve({
            err: 0,
            msg: 'OK',
        })

    } catch (error) {
        reject(error)
    }
})

export const getPostsOfUserService = (userId) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Post.findAll({
            where: { userId },
            raw: true,
            nest: true,
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published', 'hashtag'] },
            ],
            attributes: ['id', 'title', 'star', 'address', 'description'],
            order: [['createdAt', 'DESC']]
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Getting posts failed.',
            response
        })

    } catch (error) {
        reject(error)
    }
})

export const getPostByIdService = (postId, userId) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Post.findOne({
            where: { id: postId },
            raw: true,
            nest: true,
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes' },
                { model: db.Overview, as: 'overviews' },
            ],
        })

        if (!response) {
            resolve({
                err: 1,
                msg: 'Post not found'
            })
            return
        }

        // Check if user owns this post (for edit permission)
        if (userId && response.userId !== userId) {
            resolve({
                err: 2,
                msg: 'You do not have permission to access this post'
            })
            return
        }

        resolve({
            err: 0,
            msg: 'OK',
            response
        })

    } catch (error) {
        reject(error)
    }
})

export const updatePostService = (postId, body, userId) => new Promise(async (resolve, reject) => {
    try {
        // Check if post exists and user owns it
        const post = await db.Post.findOne({
            where: { id: postId }
        })

        if (!post) {
            resolve({
                err: 1,
                msg: 'Post not found'
            })
            return
        }

        if (post.userId !== userId) {
            resolve({
                err: 2,
                msg: 'You do not have permission to edit this post'
            })
            return
        }

        // Update Post
        await db.Post.update({
            categoryCode: body.categoryCode,
            title: body.title,
            star: body.star || 0,
            labelCode: body.labelCode,
            address: body.address,
            description: JSON.stringify(body.description) || null,
            areaCode: body.areaCode,
            priceCode: body.priceCode,
            provinceCode: body.province?.includes('Thành phố') ? 'CTIHTPHO' : body.province?.includes('Hồ Chí Minh') ? 'CTIHTPHO' : 'NDTIHTDN',
            priceNumber: body.priceNumber / Math.pow(10, 6),
            areaNumber: body.areaNumber
        }, {
            where: { id: postId }
        })

        // Update Attribute - use attributesId from Post
        if (post.attributesId) {
            await db.Attribute.update({
                price: +body.priceNumber < 1000000 ? `${+body.priceNumber / 1000} nghìn/tháng` : `${+body.priceNumber / 1000000} triệu/tháng`,
                acreage: `${body.areaNumber} m2`,
            }, {
                where: { id: post.attributesId }
            })
        }

        // Update Images - use imagesId from Post
        if (post.imagesId) {
            await db.Image.update({
                image: JSON.stringify(body.images)
            }, {
                where: { id: post.imagesId }
            })
        }

        // Update Overview - use overviewId from Post
        if (post.overviewId) {
            await db.Overview.update({
                area: body.address,
                type: body?.categoryName,
                target: body?.target,
            }, {
                where: { id: post.overviewId }
            })
        }

        resolve({
            err: 0,
            msg: 'Post updated successfully',
        })

    } catch (error) {
        reject(error)
    }
})

export const deletePostService = (postId, userId) => new Promise(async (resolve, reject) => {
    try {
        // Check if post exists and user owns it
        const post = await db.Post.findOne({
            where: { id: postId }
        })

        if (!post) {
            resolve({
                err: 1,
                msg: 'Post not found'
            })
            return
        }

        if (post.userId !== userId) {
            resolve({
                err: 2,
                msg: 'You do not have permission to delete this post'
            })
            return
        }

        // Hard delete - delete from all related tables using foreign keys from Post
        if (post.imagesId) {
            await db.Image.destroy({ where: { id: post.imagesId } })
        }
        if (post.attributesId) {
            await db.Attribute.destroy({ where: { id: post.attributesId } })
        }
        if (post.overviewId) {
            await db.Overview.destroy({ where: { id: post.overviewId } })
        }
        await db.Post.destroy({ where: { id: postId } })

        resolve({
            err: 0,
            msg: 'Post deleted successfully',
        })

    } catch (error) {
        reject(error)
    }
})