'use server'

import { Customer, getCustomers, PaginatedResponse } from '@/lib/customer'

export async function fetchCustomers(page: number, pageSize: number): Promise<PaginatedResponse<Customer>> {
  return getCustomers(page, pageSize)
}
