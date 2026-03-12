'use server'

import { CustomerDetail, getCustomerDetail } from '@/lib/customer-detail'
import { PaginatedResponse } from '@/lib/customer'

export async function fetchCustomerDetails(
  page: number,
  pageSize: number,
  search?: string
): Promise<PaginatedResponse<CustomerDetail>> {
  return getCustomerDetail(page, pageSize, search)
}
