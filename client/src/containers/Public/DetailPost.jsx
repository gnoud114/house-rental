import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiGetPostDetail } from '../../services'
import icons from '../../utils/icons'
import moment from 'moment'
import 'moment/locale/vi'

const { GrStar, MdOutlineLibraryBooks, BsTelephone, SiZalo } = icons

const DetailPost = () => {
    const { postId } = useParams()
    const [post, setPost] = useState(null)
    const [currentImage, setCurrentImage] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchPostDetail()
    }, [postId])

    const fetchPostDetail = async () => {
        try {
            setIsLoading(true)
            const response = await apiGetPostDetail(postId)
            if (response.data.err === 0) {
                setPost(response.data.response)
            }
        } catch (error) {
            console.error('Error fetching post detail:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleStar = (star) => {
        let stars = []
        for (let i = 1; i <= +star; i++) {
            stars.push(<GrStar key={i} className='star-item' size={18} color='yellow' />)
        }
        return stars
    }

    if (isLoading) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <div className='text-xl'>Đang tải...</div>
            </div>
        )
    }

    if (!post) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <div className='text-xl text-red-500'>Không tìm thấy bài đăng</div>
            </div>
        )
    }

    const images = post.images ? JSON.parse(post.images.image) : []

    return (
        <div className='w-full bg-white'>
            <div className='w-4/5 mx-auto py-8'>
                <div className='flex gap-8'>
                    {/* Left Section - Main Content */}
                    <div className='w-2/3'>
                        {/* Image Gallery */}
                        <div className='mb-6'>
                            <div className='w-full h-[400px] mb-4'>
                                <img
                                    src={images[currentImage]}
                                    alt={post.title}
                                    className='w-full h-full object-cover rounded-lg'
                                />
                            </div>
                            <div className='grid grid-cols-4 gap-2'>
                                {images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`${post.title} ${index + 1}`}
                                        className={`w-full h-24 object-cover rounded cursor-pointer ${
                                            currentImage === index ? 'border-4 border-blue-500' : 'border border-gray-300'
                                        }`}
                                        onClick={() => setCurrentImage(index)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Title and Price */}
                        <div className='mb-6'>
                            <div className='flex items-center gap-2 mb-2'>
                                {handleStar(post.star).map((star, index) => (
                                    <span key={index}>{star}</span>
                                ))}
                            </div>
                            <h1 className='text-2xl font-bold text-red-600 mb-4'>{post.title}</h1>
                            <div className='flex items-center gap-4 mb-4'>
                                <span className='text-2xl font-bold text-green-600'>{post.attributes?.price}</span>
                                <span className='text-lg'>{post.attributes?.acreage}</span>
                                <span className='text-gray-500'>{post.address}</span>
                            </div>
                            <p className='text-sm text-gray-500'>
                                Đăng ngày: {moment(post.createdAt).format('DD/MM/YYYY')} • 
                                Mã tin: #{post.attributes?.hashtag}
                            </p>
                        </div>

                        {/* Description */}
                        <div className='mb-6'>
                            <h2 className='text-xl font-semibold mb-4'>Thông tin mô tả</h2>
                            <div className='text-gray-700 leading-relaxed whitespace-pre-line'>
                                {typeof post.description === 'string' 
                                    ? JSON.parse(post.description) 
                                    : post.description}
                            </div>
                        </div>

                        {/* Property Details */}
                        <div className='mb-6'>
                            <h2 className='text-xl font-semibold mb-4'>Đặc điểm tin đăng</h2>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='flex'>
                                    <span className='font-medium w-40'>Mã tin:</span>
                                    <span>#{post.attributes?.hashtag}</span>
                                </div>
                                <div className='flex'>
                                    <span className='font-medium w-40'>Khu vực:</span>
                                    <span>{post.address}</span>
                                </div>
                                <div className='flex'>
                                    <span className='font-medium w-40'>Loại tin:</span>
                                    <span>{post.overviews?.type || 'Cho thuê'}</span>
                                </div>
                                <div className='flex'>
                                    <span className='font-medium w-40'>Đối tượng:</span>
                                    <span>{post.overviews?.target || 'Tất cả'}</span>
                                </div>
                                <div className='flex'>
                                    <span className='font-medium w-40'>Ngày đăng:</span>
                                    <span>{post.attributes?.published}</span>
                                </div>
                                <div className='flex'>
                                    <span className='font-medium w-40'>Ngày hết hạn:</span>
                                    <span>{moment(post.overviews?.expired).format('DD/MM/YYYY')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Contact Info */}
                    <div className='w-1/3'>
                        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6 sticky top-4'>
                            <h3 className='text-xl font-semibold mb-4'>Thông tin liên hệ</h3>
                            
                            <div className='flex items-center gap-4 mb-4'>
                                <img
                                    src={post.user?.avatar || 'https://res.cloudinary.com/debctrjed/image/upload/v1769458772/default-avatar-icon_ulpdeg.jpg'}
                                    alt={post.user?.name}
                                    className='w-16 h-16 rounded-full object-cover'
                                />
                                <div>
                                    <p className='font-semibold text-lg'>{post.user?.name}</p>
                                    <p className='text-sm text-gray-500'>Đang hoạt động</p>
                                </div>
                            </div>

                            <div className='space-y-3'>
                                <button
                                    className='w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold'
                                    onClick={() => window.open(`tel:${post.user?.phone}`)}
                                >
                                    <BsTelephone size={20} />
                                    {post.user?.phone}
                                </button>
                                <button
                                    className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold'
                                    onClick={() => window.open(`https://zalo.me/${post.user?.zalo || post.user?.phone}`)}
                                >
                                    <SiZalo size={20} />
                                    Nhắn Zalo
                                </button>
                            </div>

                            <div className='mt-6 pt-6 border-t border-gray-300'>
                                <h4 className='font-semibold mb-3'>Thông tin khác</h4>
                                <div className='space-y-2 text-sm'>
                                    <div className='flex justify-between'>
                                        <span className='text-gray-600'>Loại tin:</span>
                                        <span className='font-medium'>{post.overviews?.bonus || 'Tin thường'}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-gray-600'>Giá:</span>
                                        <span className='font-medium text-green-600'>{post.attributes?.price}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-gray-600'>Diện tích:</span>
                                        <span className='font-medium'>{post.attributes?.acreage}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailPost