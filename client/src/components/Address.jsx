import React, { memo, useEffect, useState } from 'react'
import { Select, InputReadOnly, InputFormV2 } from '../components'
import dataProvinces from '../assets/provinces.json'

const Address = ({ setPayload, payload }) => {

    const [provinces, setProvinces] = useState([])
    const [districts, setDistricts] = useState([])
    const [province, setProvince] = useState('')
    const [district, setDistrict] = useState('')
    const [reset, setReset] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)
    const [userHasChanged, setUserHasChanged] = useState(false)

    useEffect(() => {
        setProvinces(dataProvinces)
    }, [])

    // Initialize province and district from payload.address when editing
    useEffect(() => {
        if (payload.address && !isInitialized && dataProvinces.length > 0) {
            const addressParts = payload.address.split(', ')
            
            // Find province by name
            const foundProvince = dataProvinces.find(p => 
                addressParts.some(part => part.includes(p.name))
            )
            
            if (foundProvince) {
                setProvince(foundProvince.code.toString())
                setDistricts(foundProvince.districts || [])
                
                // Find district by name
                if (foundProvince.districts && addressParts.length > 1) {
                    const foundDistrict = foundProvince.districts.find(d => 
                        addressParts[0].includes(d.name)
                    )
                    if (foundDistrict) {
                        setDistrict(foundDistrict.code.toString())
                    }
                }
            }
            setIsInitialized(true)
        } else if (!payload.address && !isInitialized) {
            // Mark as initialized even without address for create mode
            setIsInitialized(true)
        }
    }, [payload.address, isInitialized])

    // Update districts when province changes
    useEffect(() => {
        const foundDistricts = dataProvinces.find(item => item.code === +province)?.districts || []
        setDistricts(foundDistricts)
        !province ? setReset(true) : setReset(false)
        if (!province) {
            setDistrict('')
        } else if (isInitialized && userHasChanged) {
            // Only clear district when user manually changes province (not during initialization)
            setDistrict('')
        }
    }, [province])

    // Only update payload.address when user changes dropdown (not during initialization)
    useEffect(() => {
        if (isInitialized && userHasChanged && (province || district)) {
            const newAddress = `${district ? `${districts?.find(item => item.code === +district)?.name}, ` : ''}${province ? provinces?.find(item => item.code === +province)?.name : ''}`
            setPayload(prev => ({
                ...prev,
                address: newAddress,
                province: province ? provinces?.find(item => item.code === +province)?.name : ''
            }))
        }
    }, [province, district, isInitialized, userHasChanged])

    // Wrapper functions to track user changes
    const handleProvinceChange = (value) => {
        setProvince(value)
        setUserHasChanged(true)
    }

    const handleDistrictChange = (value) => {
        setDistrict(value)
        setUserHasChanged(true)
    }

    return (
        <div>
            <h2 className='font-semibold text-xl py-4'>Địa chỉ cho thuê</h2>
            <div className='flex flex-col gap-4'>
                <div className='flex items-center gap-4'>
                    <Select type='province' value={province} setValue={handleProvinceChange} options={provinces} label='Tỉnh/Thành phố' />
                    <Select reset={reset} type='district' value={district} setValue={handleDistrictChange} options={districts} label='Quận/Huyện' />
                </div>
                <InputFormV2
                    label='Địa chỉ chính xác'
                    value={payload.address}
                    setValue={setPayload}
                    name='address'
                />
            </div>
        </div>
    )
}

export default memo(Address)