'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getCustomerById } from '@/lib/customer'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import useSWR from 'swr'

const CustomerDetail: React.FC = () => {
  const pathname = usePathname().split('/')
  const id = pathname[pathname.length - 1]
  const [firstname, setFirstname] = useState<string>('')
  const [lastname, setLastname] = useState<string>('')
  const { isLoading } = useSWR(['customer', id], () => getCustomerById(id), {
    onSuccess: (data) => {
      setFirstname(data.firstname)
      setLastname(data.lastname)
    },
  })
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
        <Button variant={`default`} size={'lg'}>
          <span>Edit Item</span>
        </Button>
      </div>
    </div>
  )
}

export default CustomerDetail
