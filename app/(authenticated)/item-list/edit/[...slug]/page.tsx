'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fetchCustomerById, editCustomer } from '../../actions'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import useSWR from 'swr'
import { toast } from 'sonner'

const EditCustomer: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname().split('/')
  const id = pathname[pathname.length - 1]
  const [firstname, setFirstname] = useState<string>('')
  const [lastname, setLastname] = useState<string>('')
  const { isLoading } = useSWR(['customer', id], () => fetchCustomerById(id), {
    onSuccess: (data) => {
      setFirstname(data.firstname)
      setLastname(data.lastname)
    },
  })
  const handleEdit = async (firstname: string, lastname: string) => {
    const isValidName = (name: string) => {
      return /^[a-zA-Zก-๙0-9\s]+$/.test(name)
    }
    if (!isValidName(firstname) || !isValidName(lastname)) {
      toast('กรุณากรอกชื่อโดยไม่มีอักขระพิเศษ', {
        description: 'ชื่อและนามสกุลต้องไม่มีอักขระพิเศษ เช่น !@#$%^&*',
        action: {
          label: 'ปิด',
          onClick: () => {},
        },
      })
      return
    }
    await editCustomer(firstname, lastname, id)
      .then(() => {
        toast('แก้ไขข้อมูลสำเร็จ', {
          description: `แก้ไข ${firstname} ${lastname} เรียบร้อยแล้ว`,
          action: {
            label: 'ปิด',
            onClick: () => {},
          },
        })
        router.replace('/item-list')
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'ไม่สามารถแก้ไขข้อมูลได้'
        toast('เกิดข้อผิดพลาด', {
          description: message,
          action: {
            label: 'ปิด',
            onClick: () => {},
          },
        })
      })
  }
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="flex flex-col gap-4">
        <p className="text-2xl font-bold ">Edit Item</p>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <Input placeholder="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
            <Input placeholder="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} />
          </>
        )}
        <Button variant={`default`} size={'lg'} onClick={() => handleEdit(firstname, lastname)}>
          <span>Edit Item</span>
        </Button>
      </div>
    </div>
  )
}

export default EditCustomer
