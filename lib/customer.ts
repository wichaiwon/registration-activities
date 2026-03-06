import { createClient } from "@/utils/supabase/server"
import axios from "axios"

export type Customer = {
    id: string
    firstname: string
    lastname: string
    created_at: string
    created_by: string
    updated_at: string
    updated_by: string
}

export type PaginatedResponse<T> = {
    data: T[]
    total: number
    totalPages: number
    page: number
    pageSize: number
}


export const getSession = async () => {
    const supabase = await createClient()
    const {
        data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error("User not logged in")
    return session
}

export const getApiConfig = () => {
    const url = process.env.NEXT_PUBLIC_CUSTOMERS_API_URL
    if (!url) throw new Error("API URL is not defined")
    const apiKey = process.env.NEXT_PUBLIC_API_KEY
    if (!apiKey) throw new Error("API key is not defined")
    return { url, apiKey }
}

export const getCustomers = async (
    page: number,
    pageSize: number,
    search?: string
): Promise<PaginatedResponse<Customer>> => {
    const session = await getSession()
    const { url, apiKey } = getApiConfig()
    const start = (page - 1) * pageSize
    const end = start + pageSize - 1
    const searchQuery = search
        ? `&or=(firstname.ilike.*${search}*,lastname.ilike.*${search}*)`
        : ''
    const response = await axios.get(`${url}?select=*${searchQuery}`, {
        headers: {
            apikey: apiKey,
            Authorization: `Bearer ${session.access_token}`,
            Range: `${start}-${end}`,
            Prefer: "count=exact",
        },
    })
    const contentRange = response.headers["content-range"] as string
    const total = contentRange ? parseInt(contentRange.split("/")[1]) : 0
    const totalPages = Math.ceil(total / pageSize)
    return {
        data: response.data,
        total,
        totalPages,
        page,
        pageSize,
    }
}

export const getCustomerById = async (id: string): Promise<Customer> => {
    const session = await getSession()
    const { url, apiKey } = getApiConfig()
    const response = await axios.get(`${url}?id=eq.${id}&select=*`, {
        headers: {
            apikey: apiKey,
            Authorization: `Bearer ${session.access_token}`,
            Accept: "application/vnd.pgrst.object+json",
        },
    })
    return response.data
}

export const createCustomer = async (firstname: string, lastname: string): Promise<Customer> => {
    const session = await getSession()
    const { url, apiKey } = getApiConfig()
    const response = await axios.post(
        url,
        { firstname, lastname },
        {
            headers: {
                apikey: apiKey,
                Authorization: `Bearer ${session.access_token}`,
                "Content-Type": "application/json",
            },
        }
    )
    return response.data
}

export const updateCustomer = async (firstname: string, lastname: string, id: string): Promise<Customer> => {
    const session = await getSession()
    const { url, apiKey } = getApiConfig()
    const response = await axios.patch(
        `${url}?id=eq.${id}`,
        { firstname, lastname, updated_by: session.user.id },
        {
            headers: {
                apikey: apiKey,
                Authorization: `Bearer ${session.access_token}`,
                "Content-Type": "application/json",
            },
        }
    )
    return response.data
}

export const deleteCustomer = async (id: string): Promise<void> => {
    const session = await getSession()
    const { url, apiKey } = getApiConfig()
    await axios.delete(`${url}?id=eq.${id}`, {
        headers: {
            apikey: apiKey,
            Authorization: `Bearer ${session.access_token}`,
        },
    })
}


