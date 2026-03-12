import axios from "axios";
import { getSession } from "./customer";

export type CustomerDetail = {
    id: string
    customer_id: string
    customer: {
        firstname: string
        lastname: string
    }
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
    search?: string
): Promise<PaginatedResponse<CustomerDetail>> => {
    const session = await getSession()
    const { url, apiKey } = getApiConfig()
    const start = (page - 1) * pageSize
    const end = start + pageSize - 1
    const searchQuery = search
        ? `&or=(phone_number.ilike.*${search}*,address.ilike.*${search}*,province.ilike.*${search}*,district.ilike.*${search}*,sub_district.ilike.*${search}*)`
        : ''
    const response = await axios.get(`${url}?select=*,customer!customer_id(firstname,lastname)${searchQuery}`, {
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

