import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

const AddCustomer: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="flex flex-col gap-4">
        <p className="text-2xl font-bold ">Add Item</p>
        <Input placeholder="firstname" />
        <Input placeholder="lastname" />
        <Button variant={`default`} size={'lg'}>
          <span>Add Item</span>
        </Button>
      </div>
    </div>
  )
}

export default AddCustomer
