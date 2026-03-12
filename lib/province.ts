import axios from "axios"

export type Province = {
    id: number,
    name_th: string,
    name_en: string,
    geography_id: number,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date | null
    districts: {
        id: number,
        name_th: string,
        name_en: string,
        province_id: number,
        created_at: Date,
        updated_at: Date,
        deleted_at: Date | null
        sub_districts: {
            id: number,
            zip_code: string,
            name_th: string,
            name_en: string,
            district_id: number,
            created_at: Date,
            updated_at: Date,
            deleted_at: Date | null
        }[]
    }[]
}

export const getProvinces = async (): Promise<Province[]> => {
    const url = process.env.NEXT_PUBLIC_PROVINCES_API_URL
    if (!url) throw new Error("Provinces API URL is not defined")
    const response = await axios.get(url)
    return response.data
}
