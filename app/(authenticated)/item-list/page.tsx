'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Customer } from '@/lib/customer'
import { fetchCustomers } from './actions'
import { EditIcon, PlusIcon, TrashIcon } from 'lucide-react'
import React, { useState } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'

const ItemList: React.FC = () => {
  const router = useRouter()
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const { data, isLoading } = useSWR(['customers', page, pageSize], () => fetchCustomers(page, pageSize), {
    keepPreviousData: true,
  })
  const customers = data && data.data ? data.data : []
  const totalPages = data && data.totalPages ? data.totalPages : 1

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setPage(newPage)
  }
  return (
    <div className="h-full">
      <div className="flex flex-col gap-4">
        <p className="text-2xl font-bold">Item List</p>
        <div className="flex justify-between items-center gap-4">
          <NativeSelect
            className="w-fit"
            value={pageSize}
            onChange={(e) => {
              setPage(1)
              setPageSize(Number(e.target.value))
            }}
          >
            <NativeSelectOption value={10}>10</NativeSelectOption>
            <NativeSelectOption value={25}>25</NativeSelectOption>
            <NativeSelectOption value={50}>50</NativeSelectOption>
            <NativeSelectOption value={100}>100</NativeSelectOption>
          </NativeSelect>
          <Input placeholder="Search..." />
          <Button variant="outline" size={'lg'}>
            Search
          </Button>
        </div>
        <div className="flex w-full justify-end items-center">
          <Button variant="secondary" size={'lg'} onClick={() => router.push(`/item-list/add`)}>
            <span>Add Item</span>
            <PlusIcon />
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">action</TableHead>
              <TableHead className="text-center">firstName</TableHead>
              <TableHead className="text-center">lastName</TableHead>
              <TableHead className="text-center">createdBy</TableHead>
              <TableHead className="text-center">createdAt</TableHead>
              <TableHead className="text-center">updatedBy</TableHead>
              <TableHead className="text-center">updatedAt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No data
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer: Customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex gap-2 justify-center items-center">
                      <Button
                      onClick={()=> router.push(`/item-list/edit/${customer.id}`)}
                        variant="outline"
                        className="text-yellow-500 hover:text-yellow-600 hover:border-yellow-600 border-yellow-500"
                        size={'sm'}
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-500 border-red-500 hover:text-red-600 hover:border-red-600"
                        size={'sm'}
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{customer.firstname}</TableCell>
                  <TableCell className="text-center">{customer.lastname}</TableCell>
                  <TableCell className="text-center">{customer.created_by}</TableCell>
                  <TableCell className="text-center">{new Date(customer.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-center">{customer.updated_by}</TableCell>
                  <TableCell className="text-center">{new Date(customer.updated_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="flex w-full justify-end items-center">
          <Button variant="secondary" size={'lg'} onClick={() => router.push(`/item-list/add`)}>
            <span>Add Item</span>
            <PlusIcon />
          </Button>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(page - 1)
                }}
                aria-disabled={page === 1}
              />
            </PaginationItem>
            {totalPages > 7 ? (
              <>
                <PaginationItem key="first">
                  <PaginationLink
                    href="#"
                    isActive={page === 1}
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(1)
                    }}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                {page > 4 && (
                  <PaginationItem key="start-ellipsis">
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                {/* สร้าง array ของเลขหน้าที่ต้องแสดง (ไม่ซ้ำ) */}
                {Array.from(new Set([...[page - 1, page, page + 1].filter((n) => n > 1 && n < totalPages)])).map(
                  (pageNumber) => (
                    <PaginationItem key={`middle-${pageNumber}`}>
                      <PaginationLink
                        href="#"
                        isActive={page === pageNumber}
                        onClick={(e) => {
                          e.preventDefault()
                          handlePageChange(pageNumber)
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                {page < totalPages - 3 && (
                  <PaginationItem key="end-ellipsis">
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem key="last">
                  <PaginationLink
                    href="#"
                    isActive={page === totalPages}
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(totalPages)
                    }}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            ) : (
              [...Array(totalPages)].map((_, idx) => (
                <PaginationItem key={`page-${idx + 1}`}>
                  <PaginationLink
                    href="#"
                    isActive={page === idx + 1}
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(idx + 1)
                    }}
                  >
                    {idx + 1}
                  </PaginationLink>
                </PaginationItem>
              ))
            )}
            <PaginationItem>
              <PaginationNext
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(page + 1)
                }}
                aria-disabled={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export default ItemList
