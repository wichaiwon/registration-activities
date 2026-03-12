'use server'

import {
  Customer,
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  PaginatedResponse,
  getAllCustomers,
  getUserEmailsByIds,
} from '@/lib/customer'

export async function fetchCustomers(page: number, pageSize: number, search?: string, sortColumn?: string, sortDirection?: 'asc' | 'desc'): Promise<PaginatedResponse<Customer>> {
  return getCustomers(page, pageSize, search, sortColumn, sortDirection)
}

export async function fetchCustomerById(id: string): Promise<Customer> {
  return getCustomerById(id)
}

export async function addCustomer(firstname: string, lastname: string): Promise<Customer> {
  return createCustomer(firstname, lastname)
}

export async function editCustomer(firstname: string, lastname: string, id: string): Promise<Customer> {
  return updateCustomer(firstname, lastname, id)
}

export async function removeCustomer(id: string): Promise<void> {
  return deleteCustomer(id)
}

export async function fetchUserEmails(ids: string[]): Promise<Record<string, string>> {
  return getUserEmailsByIds(ids)
}
