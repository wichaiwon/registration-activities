import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ItemList from './item-list/page'

export default async function Page() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }


    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <ItemList />
            <div className="bg-muted/50 flex-1 rounded-xl" />
        </div>
    )
}