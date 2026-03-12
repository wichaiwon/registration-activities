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
import { fetchCustomers, removeCustomer } from './actions'
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon, EditIcon, PlusIcon, TrashIcon } from 'lucide-react'
import React, { useState } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'

const ItemList: React.FC = () => {
  const router = useRouter()
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [search, setSearch] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortColumn, setSortColumn] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const { data, isLoading, mutate } = useSWR(
    ['customers', page, pageSize, searchQuery, sortColumn, sortDirection],
    () => fetchCustomers(page, pageSize, searchQuery, sortColumn, sortDirection),

    {
      keepPreviousData: true,
    }
  )
  const customers = data && data.data ? data.data : []
  const totalPages = data && data.totalPages ? data.totalPages : 1

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setPage(newPage)
  }

  const handleSearch = () => {
    setPage(1)
    setSearchQuery(search)
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
    setPage(1)
  }

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) return <ArrowUpDownIcon className="inline ml-1 h-3 w-3 opacity-40" />
    return sortDirection === 'asc'
      ? <ArrowUpIcon className="inline ml-1 h-3 w-3" />
      : <ArrowDownIcon className="inline ml-1 h-3 w-3" />
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
          <Button variant="secondary" size={'lg'} onClick={() => router.push(`/customer/add`)}>
            <span>Add Item</span>
            <PlusIcon />
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">action</TableHead>
              {[
                { key: 'firstname', label: 'firstName' },
                { key: 'lastname', label: 'lastName' },
                { key: 'created_by', label: 'createdBy' },
                { key: 'created_at', label: 'createdAt' },
                { key: 'updated_by', label: 'updatedBy' },
                { key: 'updated_at', label: 'updatedAt' },
              ].map((col) => (
                <TableHead
                  key={col.key}
                  className="text-center cursor-pointer select-none hover:bg-muted/50"
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  <SortIcon column={col.key} />
                </TableHead>
              ))}
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
                <TableRow
                  key={customer.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/customer-detail/edit/${customer.id}`)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2 justify-center items-center">
                      <Button
                        onClick={() => router.push(`/customer/edit/${customer.id}`)}
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
                        onClick={async () => {
                          await removeCustomer(customer.id)
                          mutate()
                        }}
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
          <Button variant="secondary" size={'lg'} onClick={() => router.push(`/customer/add`)}>
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
                {/* สร้าง array ของเลขหน้าที่ต้องแสดง (ไม่ซ้ำ) */}
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

export default ItemList
