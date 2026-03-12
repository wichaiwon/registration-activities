import axios from "axios";
import { getSession } from "./customer";

export type CustomerDetail = {
    id: string
    customer_id: string
    phone_number: string
    address: string
    province: string
    district: string
    sub_district: string
    created_by: string
    created_at: string
    updated_by: string
    updated_at: string
}


export type PaginatedResponse<T> = {
    data: T[]
    total: number
    totalPages: number
    page: number
    pageSize: number
}

export const getApiConfig = () => {
    const url = process.env.NEXT_PUBLIC_CUSTOMER_DETAIL_API_URL
    if (!url) throw new Error("API URL is not defined")
    const apiKey = process.env.NEXT_PUBLIC_API_KEY
    if (!apiKey) throw new Error("API key is not defined")
    return { url, apiKey }
}

export const getCustomerDetail = async (
    page: number,
    pageSize: number,
    search?: string,
    sortColumn?: string,
    sortDirection?: 'asc' | 'desc'
): Promise<PaginatedResponse<CustomerDetail>> => {
    const session = await getSession()
    const { url, apiKey } = getApiConfig()
    const start = (page - 1) * pageSize
    const end = start + pageSize - 1
    const searchQuery = search
        ? `&or=(phone_number.ilike.*${search}*,address.ilike.*${search}*,province.ilike.*${search}*,district.ilike.*${search}*,sub_district.ilike.*${search}*)`
        : ''
    const orderQuery = sortColumn ? `&order=${sortColumn}.${sortDirection ?? 'asc'}` : ''
    const response = await axios.get(`${url}?select=*${searchQuery}${orderQuery}`, {
        headers: {
            apikey: apiKey,
            Authorization: `Bearer ${session.access_token}`,
            Range: `${start}-${end}`,
            Prefer: 'count=exact',
        },
    })
    const contentRange = response.headers['content-range'] as string
    const total = contentRange ? parseInt(contentRange.split('/')[1]) : 0
    const totalPages = Math.ceil(total / pageSize)
    return {
        data: response.data,
        total,
        totalPages,
        page,
        pageSize,
    }
}

export const getCustomerDetailByCustomerId = async (customerId: string): Promise<CustomerDetail> => {
    const session = await getSession()
    const { url, apiKey } = getApiConfig()
    const response = await axios.get(`${url}?customer_id=eq.${customerId}&select=*`, {
        headers: {
            apikey: apiKey,
            Authorization: `Bearer ${session.access_token}`,
            Accept: 'application/vnd.pgrst.object+json',
        },
    })
    return response.data
}

export const getCustomerDetailById = async (id: string): Promise<CustomerDetail> => {
    const session = await getSession()
    const { url, apiKey } = getApiConfig()
    const response = await axios.get(`${url}?id=eq.${id}&select=*`, {
        headers: {
            apikey: apiKey,
            Authorization: `Bearer ${session.access_token}`,
            Accept: 'application/vnd.pgrst.object+json',
        },
    })
    return response.data
}

export const createCustomerDetail = async (
    customer_id: string,
    phone_number: string,
    address: string,
    province: string,
    district: string,
    sub_district: string,
): Promise<CustomerDetail> => {
    const session = await getSession()
    const { url, apiKey } = getApiConfig()
    const response = await axios.post(
        url,
        { customer_id, phone_number, address, province, district, sub_district },
        {
            headers: {
                apikey: apiKey,
                Authorization: `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
            },
        }
    )
    return response.data
}

export const updateCustomerDetail = async (
    id: string,
    phone_number: string,
    address: string,
    province: string,
    district: string,
    sub_district: string,
): Promise<void> => {
    const session = await getSession()
    const { url, apiKey } = getApiConfig()
    await axios.patch(
        `${url}?id=eq.${id}`,
        { phone_number, address, province, district, sub_district, updated_by: session.user.id },
        {
            headers: {
                apikey: apiKey,
                Authorization: `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
            },
        }
    )
}

export const deleteCustomerDetail = async (id: string): Promise<void> => {
    const session = await getSession()
    const { url, apiKey } = getApiConfig()
    await axios.delete(`${url}?id=eq.${id}`, {
        headers: {
            apikey: apiKey,
            Authorization: `Bearer ${session.access_token}`,
        },
    })
}

