'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(data: { email: string; password: string; full_name: string }) {
    const supabase = await createClient()

    const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            data: {
                full_name: data.full_name,
            },
        },
    })

    if (error) {
        return { error: error.message }
    }

    if (!signUpData.user) {
        return {
            error: 'This email may already be registered. Please check your email for a confirmation link or try logging in.',
        }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}