'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { fetchCustomerDetailByCustomerId, editCustomerDetail, fetchProvinces } from '../../actions'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import useSWR from 'swr'
import { toast } from 'sonner'

const EditCustomerDetail: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname().split('/')
  const detailId = pathname[pathname.length - 1]

  const [recordId, setRecordId] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [selectedProvince, setSelectedProvince] = useState<string>('')
  const [selectedDistrict, setSelectedDistrict] = useState<string>('')
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<string>('')

  const { isLoading: loadingDetail } = useSWR(
    ['customerDetail', detailId],
    () => fetchCustomerDetailByCustomerId(detailId),
    {
      onSuccess: (data) => {
        setRecordId(data.id)
        setPhoneNumber(data.phone_number)
        setAddress(data.address)
        setSelectedProvince(data.province)
        setSelectedDistrict(data.district)
        setSelectedSubDistrict(data.sub_district)
      },
    }
  )

  const { data: provinces, isLoading: loadingProvinces } = useSWR('provinces', fetchProvinces)

  const provinceObj = provinces?.find((p) => p.name_th === selectedProvince)
  const districtObj = provinceObj?.districts.find((d) => d.name_th === selectedDistrict)

  const handleEdit = async () => {
    if (!phoneNumber.trim() || !address.trim() || !selectedProvince || !selectedDistrict || !selectedSubDistrict) {
      toast('กรุณากรอกข้อมูลให้ครบถ้วน', {
        action: { label: 'ปิด', onClick: () => {} },
      })
      return
    }
    await editCustomerDetail(recordId, phoneNumber, address, selectedProvince, selectedDistrict, selectedSubDistrict)
      .then(() => {
        toast('แก้ไขข้อมูลสำเร็จ', {
          description: `แก้ไขข้อมูลลูกค้าเรียบร้อยแล้ว`,
          action: { label: 'ปิด', onClick: () => {} },
        })
        router.replace('/customer-detail')
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'ไม่สามารถแก้ไขข้อมูลได้'
        toast('เกิดข้อผิดพลาด', {
          description: message,
          action: { label: 'ปิด', onClick: () => {} },
        })
      })
  }

  const isLoading = loadingDetail || loadingProvinces

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="flex flex-col gap-4 w-full max-w-md">
        <p className="text-2xl font-bold">Edit Customer Detail</p>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <Input
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <NativeSelect
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value)
                setSelectedDistrict('')
                setSelectedSubDistrict('')
              }}
            >
              <NativeSelectOption value="">-- เลือกจังหวัด --</NativeSelectOption>
              {provinces?.map((p) => (
                <NativeSelectOption key={p.id} value={p.name_th}>
                  {p.name_th}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <NativeSelect
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value)
                setSelectedSubDistrict('')
              }}
              disabled={!selectedProvince}
            >
              <NativeSelectOption value="">-- เลือกอำเภอ --</NativeSelectOption>
              {provinceObj?.districts.map((d) => (
                <NativeSelectOption key={d.id} value={d.name_th}>
                  {d.name_th}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <NativeSelect
              value={selectedSubDistrict}
              onChange={(e) => setSelectedSubDistrict(e.target.value)}
              disabled={!selectedDistrict}
            >
              <NativeSelectOption value="">-- เลือกตำบล --</NativeSelectOption>
              {districtObj?.sub_districts.map((s) => (
                <NativeSelectOption key={s.id} value={s.name_th}>
                  {s.name_th}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </>
        )}
        <Button variant="default" size="lg" onClick={handleEdit} disabled={isLoading}>
          <span>Save</span>
        </Button>
        <Button variant="outline" size="lg" onClick={() => router.back()}>
          <span>Cancel</span>
        </Button>
      </div>
    </div>
  )
}

export default EditCustomerDetail
