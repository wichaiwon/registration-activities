'use server'

import {
  CustomerDetail,
  getCustomerDetail,
  getCustomerDetailById,
  getCustomerDetailByCustomerId,
  createCustomerDetail,
  updateCustomerDetail,
  deleteCustomerDetail,
} from '@/lib/customer-detail'
import { PaginatedResponse, Customer, getAllCustomers, getUserEmailsByIds } from '@/lib/customer'
import { getProvinces, Province } from '@/lib/province'

export async function fetchCustomerDetails(
  page: number,
  pageSize: number,
  search?: string,
  sortColumn?: string,
  sortDirection?: 'asc' | 'desc'
): Promise<PaginatedResponse<CustomerDetail>> {
  return getCustomerDetail(page, pageSize, search, sortColumn, sortDirection)
}

export async function fetchCustomerDetailByCustomerId(customerId: string): Promise<CustomerDetail> {
  return getCustomerDetailByCustomerId(customerId)
}

export async function fetchCustomerDetailById(id: string): Promise<CustomerDetail> {
  return getCustomerDetailById(id)
}

export async function addCustomerDetail(
  customer_id: string,
  phone_number: string,
  address: string,
  province: string,
  district: string,
  sub_district: string,
): Promise<CustomerDetail> {
  return createCustomerDetail(customer_id, phone_number, address, province, district, sub_district)
}

export async function editCustomerDetail(
  id: string,
  phone_number: string,
  address: string,
  province: string,
  district: string,
  sub_district: string,
): Promise<void> {
  return updateCustomerDetail(id, phone_number, address, province, district, sub_district)
}

export async function removeCustomerDetail(id: string): Promise<void> {
  return deleteCustomerDetail(id)
}

export async function fetchAllCustomers(): Promise<Customer[]> {
  return getAllCustomers()
}

export async function fetchUserEmails(ids: string[]): Promise<Record<string, string>> {
  return getUserEmailsByIds(ids)
}

export async function fetchProvinces(): Promise<Province[]> {
  return getProvinces()
}
