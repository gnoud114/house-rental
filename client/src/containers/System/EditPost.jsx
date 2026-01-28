import React, { useState, useEffect } from 'react'
import { Overview, Address, Loading, Button } from '../../components'
import { apiUploadImages, apiUpdatePost, apiGetPostById } from '../../services'
import icons from '../../utils/icons'
import { getCodes, getCodesArea } from '../../utils/Common/getCodes'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const { BsCameraFill, ImBin } = icons

const EditPost = () => {
    const { postId } = useParams()
    const navigate = useNavigate()

    const [payload, setPayload] = useState({
        categoryCode: '',
        title: '',
        priceNumber: 0,
        areaNumber: 0,
        images: [],
        address: '',
        priceCode: '',
        areaCode: '',
        description: '',
        target: '',
        province: ''
    })
    const [imagesPreview, setImagesPreview] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingPost, setIsLoadingPost] = useState(true)
    const { prices, areas } = useSelector(state => state.app)

    useEffect(() => {
        fetchPost()
    }, [postId])

    const fetchPost = async () => {
        try {
            setIsLoadingPost(true)
            const response = await apiGetPostById(postId)
            if (response.data.err === 0) {
                const post = response.data.response
                setPayload({
                    categoryCode: post.categoryCode || '',
                    title: post.title || '',
                    priceNumber: post.priceNumber * Math.pow(10, 6) || 0,
                    areaNumber: post.areaNumber || 0,
                    images: post.images ? JSON.parse(post.images.image) : [],
                    address: post.address || '',
                    priceCode: post.priceCode || '',
                    areaCode: post.areaCode || '',
                    description: post.description || '',
                    target: post.overviews?.target || '',
                    province: post.province || ''
                })
                setImagesPreview(post.images ? JSON.parse(post.images.image) : [])
            } else {
                Swal.fire('Lỗi', response.data.msg, 'error')
                navigate('/he-thong/quan-ly-bai-dang')
            }
        } catch (error) {
            console.error('Error fetching post:', error)
            Swal.fire('Lỗi', 'Không thể tải bài đăng', 'error')
            navigate('/he-thong/quan-ly-bai-dang')
        } finally {
            setIsLoadingPost(false)
        }
    }

    const handleFiles = async (e) => {
        e.stopPropagation()
        setIsLoading(true)
        let images = []
        let files = e.target.files
        let formData = new FormData()
        for (let i of files) {
            formData.append('file', i)
            formData.append('upload_preset', import.meta.env.VITE_UPLOAD_ASSETS_NAME)
            let response = await apiUploadImages(formData)
            if (response.status === 200) images = [...images, response.data?.secure_url]
        }
        setIsLoading(false)
        setImagesPreview(prev => [...prev, ...images])
        setPayload(prev => ({ ...prev, images: [...prev.images, ...images] }))
    }

    const handleDeleteImage = (image) => {
        setImagesPreview(prev => prev?.filter(item => item !== image))
        setPayload(prev => ({
            ...prev,
            images: prev.images?.filter(item => item !== image)
        }))
    }

    const handleSubmit = async () => {
        let priceCodeArr = getCodes(+payload.priceNumber / Math.pow(10, 6), prices)
        let areaCodeArr = getCodesArea(+payload.areaNumber, areas)

        let finalPayload = {
            ...payload,
            priceCode: priceCodeArr[0]?.code,
            areaCode: areaCodeArr[0]?.code,
            label: `${payload.title} ${payload.address}`
        }

        const response = await apiUpdatePost(postId, finalPayload)
        if (response.data.err === 0) {
            Swal.fire('Thành công', 'Đã cập nhật bài đăng', 'success').then(() => {
                navigate('/he-thong/quan-ly-bai-dang')
            })
        } else {
            Swal.fire('Thất bại', response.data.msg, 'error')
        }
    }

    if (isLoadingPost) {
        return (
            <div className='px-6'>
                <div className='flex items-center justify-center py-10'>
                    <Loading />
                </div>
            </div>
        )
    }

    return (
        <div className='px-6'>
            <h1 className='text-3xl font-medium py-4 border-b border-gray-200'>Chỉnh sửa bài đăng</h1>
            <div className='flex gap-4'>
                <div className='py-4 flex flex-col gap-8 flex-auto'>
                    <Address payload={payload} setPayload={setPayload} />
                    <Overview payload={payload} setPayload={setPayload} />
                    <div className='w-full mb-6'>
                        <h2 className='font-semibold text-xl py-4'>Hình ảnh</h2>
                        <small>Cập nhật hình ảnh rõ ràng sẽ cho thuê nhanh hơn</small>
                        <div className='w-full'>
                            <label className='w-full border-2 h-[200px] my-4 gap-4 flex flex-col items-center justify-center border-gray-400 border-dashed rounded-md' htmlFor="file">
                                {isLoading
                                    ? <Loading />
                                    : <div className='flex flex-col items-center justify-center'>
                                        <BsCameraFill color='blue' size={50} />
                                        Thêm ảnh
                                    </div>}
                            </label>
                            <input onChange={handleFiles} hidden type="file" id='file' multiple />
                            <div className='w-full'>
                                <h3 className='font-medium py-4'>Ảnh đã chọn</h3>
                                <div className='flex gap-4 items-center'>
                                    {imagesPreview?.map(item => {
                                        return (
                                            <div key={item} className='relative w-1/3 h-1/3 '>
                                                <img src={item} alt="preview" className='w-full h-full object-cover rounded-md' />
                                                <span
                                                    title='Xóa'
                                                    onClick={() => handleDeleteImage(item)}
                                                    className='absolute top-0 right-0 p-2 cursor-pointer bg-gray-300 hover:bg-gray-400 rounded-full'
                                                >
                                                    <ImBin />
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-4'>
                        <Button onClick={handleSubmit} text='Cập nhật' bgColor='bg-green-600' textColor='text-white' />
                        <Button onClick={() => navigate('/he-thong/quan-ly-bai-dang')} text='Hủy' bgColor='bg-gray-400' textColor='text-white' />
                    </div>
                    <div className='h-[500px]'>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditPost
