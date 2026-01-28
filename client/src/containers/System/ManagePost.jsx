import React, { useEffect, useState } from 'react'
import { apiGetPostsOfUser, apiDeletePost } from '../../services'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import moment from 'moment'
import { Button } from '../../components'

const ManagePost = () => {
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            setIsLoading(true)
            const response = await apiGetPostsOfUser()
            if (response.data.err === 0) {
                setPosts(response.data.response)
            }
        } catch (error) {
            console.error('Error fetching posts:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (postId) => {
        Swal.fire({
            title: 'Xác nhận xóa',
            text: 'Bạn có chắc chắn muốn xóa bài đăng này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeletePost(postId)
                if (response.data.err === 0) {
                    Swal.fire('Thành công', 'Đã xóa bài đăng', 'success')
                    fetchPosts()
                } else {
                    Swal.fire('Thất bại', response.data.msg, 'error')
                }
            }
        })
    }

    const handleEdit = (postId) => {
        navigate(`/he-thong/chinh-sua-bai-dang/${postId}`)
    }

    return (
        <div className='px-6'>
            <h1 className='text-3xl font-medium py-4 border-b border-gray-200'>Quản lý tin đăng</h1>
            <div className='py-4'>
                {isLoading ? (
                    <div className='flex items-center justify-center py-10'>
                        <div className='text-lg'>Đang tải...</div>
                    </div>
                ) : posts.length === 0 ? (
                    <div className='flex items-center justify-center py-10'>
                        <div className='text-lg text-gray-500'>Bạn chưa có bài đăng nào</div>
                    </div>
                ) : (
                    <div className='space-y-4'>
                        {posts.map((post) => (
                            <div key={post.id} className='border border-gray-300 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow'>
                                <div className='flex gap-4'>
                                    <div className='flex-shrink-0 w-40 h-32'>
                                        {post.images && JSON.parse(post.images.image)[0] && (
                                            <img
                                                src={JSON.parse(post.images.image)[0]}
                                                alt={post.title}
                                                className='w-full h-full object-cover rounded-md'
                                            />
                                        )}
                                    </div>
                                    <div className='flex-1'>
                                        <h3 className='text-lg font-semibold text-red-600 mb-2'>{post.title}</h3>
                                        <div className='text-sm text-gray-600 space-y-1'>
                                            <p><span className='font-medium'>Địa chỉ:</span> {post.address}</p>
                                            {post.attributes && (
                                                <>
                                                    <p><span className='font-medium'>Giá:</span> {post.attributes.price}</p>
                                                    <p><span className='font-medium'>Diện tích:</span> {post.attributes.acreage}</p>
                                                    <p><span className='font-medium'>Ngày đăng:</span> {post.attributes.published}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-2 justify-center'>
                                        <Button
                                            text='Sửa'
                                            bgColor='bg-blue-500'
                                            textColor='text-white'
                                            onClick={() => handleEdit(post.id)}
                                        />
                                        <Button
                                            text='Xóa'
                                            bgColor='bg-red-500'
                                            textColor='text-white'
                                            onClick={() => handleDelete(post.id)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ManagePost
