'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { addCustomer } from '../actions'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

const AddCustomer: React.FC = () => {
  const router = useRouter()
  const [firstname, setFirstname] = useState<string>('')
  const [lastname, setLastname] = useState<string>('')

  const handleAdd = async (firstname: string, lastname: string) => {
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
    addCustomer(firstname, lastname)
      .then(() => {
        toast('เพิ่มข้อมูลสำเร็จ', {
          description: `เพิ่ม ${firstname} ${lastname} เรียบร้อยแล้ว`,
          action: {
            label: 'ปิด',
            onClick: () => {},
          },
        })
        router.replace('/item-list')
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'ไม่สามารถเพิ่มข้อมูลได้'
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
        <p className="text-2xl font-bold ">Add Item</p>
        <Input placeholder="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
        <Input placeholder="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} />
        <Button variant={`default`} size={'lg'} onClick={() => handleAdd(firstname, lastname)}>
          <span>Add Item</span>
        </Button>
      </div>
    </div>
  )
}

export default AddCustomer
