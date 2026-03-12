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
import { EditIcon, PlusIcon, TrashIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { fetchCustomerDetails } from './actions'

const CustomerDetail: React.FC = () => {
  const router = useRouter()
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [search, setSearch] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const { data, isLoading, mutate } = useSWR(
    ['customerDetails', page, pageSize, searchQuery],
    () => fetchCustomerDetails(page, pageSize, searchQuery),
    { keepPreviousData: true }
  )
  const customerDetails = data?.data ?? []
  const totalPages = data?.totalPages ?? 1
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setPage(newPage)
  }

  const handleSearch = () => {
    setPage(1)
    setSearchQuery(search)
  }

  return (
    <div className="h-full overflow-x-hidden">
      <div className="flex flex-col gap-4">
        <p className="text-2xl font-bold">Customer Detail</p>
        <div className="flex justify-between items-center gap-4">
          <NativeSelect
            className="w-fit"
            value={pageSize}
            onChange={(e) => {
              setPage(1)
              setPageSize(Number(e.target.value))
            }}
          >
            {[10, 25, 50, 100].map((size) => (
              <NativeSelectOption key={size} value={size}>
                {size}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button variant="outline" size={'lg'} onClick={handleSearch}>
            Search
          </Button>
        </div>
        <div className="flex w-full justify-end items-center">
          <Button variant="secondary" size={'lg'} onClick={() => router.push(`/customer-detail/add`)}>
            <span>Add Item</span>
            <PlusIcon />
          </Button>
        </div>
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {[
                { key: 'action', label: 'action', className: 'text-center' },
                { key: 'firstname-lastname', label: 'firstName-lastname', className: 'text-center' },
                { key: 'phone_number', label: 'phoneNumber', className: 'text-center' },
                { key: 'address', label: 'address', className: 'text-center' },
                { key: 'province', label: 'province', className: 'text-center' },
                { key: 'district', label: 'district', className: 'text-center' },
                { key: 'sub_district', label: 'subDistrict', className: 'text-center' },
                { key: 'created_by', label: 'createdBy', className: 'text-center' },
                { key: 'created_at', label: 'createdAt', className: 'text-center' },
                { key: 'updated_by', label: 'updatedBy', className: 'text-center' },
                { key: 'updated_at', label: 'updatedAt', className: 'text-center' },
              ].map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : customerDetails.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center">No data</TableCell>
              </TableRow>
            ) : customerDetails.map((customerdetail) => (
              <TableRow key={customerdetail.id}>
                <TableCell>
                  <div className="flex gap-2 justify-center items-center">
                    <Button
                      onClick={() => router.push(`/customer-detail/edit/${customerdetail.id}`)}
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
                      onClick={() => {}}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-center">{customerdetail.customer.firstname} {customerdetail.customer.lastname}</TableCell>
                <TableCell className="text-center">{customerdetail.phone_number}</TableCell>
                <TableCell className="text-center">{customerdetail.address}</TableCell>
                <TableCell className="text-center">{customerdetail.province}</TableCell>
                <TableCell className="text-center">{customerdetail.district}</TableCell>
                <TableCell className="text-center">{customerdetail.sub_district}</TableCell>
                <TableCell className="text-center">{customerdetail.created_by}</TableCell>
                <TableCell className="text-center">{new Date(customerdetail.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-center">{customerdetail.updated_by}</TableCell>
                <TableCell className="text-center">{new Date(customerdetail.updated_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
        <div className="flex w-full justify-end items-center">
          <Button variant="secondary" size={'lg'} onClick={() => router.push(`/customer-detail/add`)}>
            <span>Add Item</span>
            <PlusIcon />
          </Button>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
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
                {Array.from(new Set([...[page - 1, page, page + 1].filter((n) => n > 1 && n < totalPages)])).map(
                  (pageNumber) => (
                    <PaginationItem key={`middle-${pageNumber}`}>
                      <PaginationLink
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

export default CustomerDetail
