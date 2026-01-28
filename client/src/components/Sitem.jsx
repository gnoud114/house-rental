import React, { memo } from 'react'
import moment from 'moment'
import 'moment/locale/vi'
import { Link } from 'react-router-dom'
import { formatVietnameseToString } from '../utils/Common/formatVietnameseToString'

const Sitem = ({ title, price, image, createdAt, id }) => {

    const formatTime = (createdAt) => {
        return moment(createdAt).fromNow()
    }

    return (
        <div className='w-full flex items-center gap-2 py-2 border-b border-gray-300'>
            <Link
                to={`/chi-tiet/${formatVietnameseToString(title)}/${id}`}
                className='w-[65px] h-[65px] flex-none'
            >
                <img
                    src={image[0]}
                    alt="anh"
                    className='w-full h-full object-cover rounded-md'
                />
            </Link>
            <div className='w-full flex-auto flex flex-col justify-between gap-1'>
                <Link to={`/chi-tiet/${formatVietnameseToString(title)}/${id}`}>
                    <h4 className='text-blue-600 text-[14px] hover:text-orange-600'>{`${title?.slice(0, 45)}...`}</h4>
                </Link>
                <div className=' flex items-center justify-between w-full'>
                    <span className='text-sm font-medium text-green-500'>{price}</span>
                    <span className='text-sm text-gray-300'>{formatTime(createdAt)}</span>
                </div>
            </div>
        </div>
    )
}

export default memo(Sitem)