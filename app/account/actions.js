'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@utils/supabase/server'

export async function updateUsername(data) {
	const supabase = await createClient()
	const { data: { user } } = await supabase.auth.getUser()
	await supabase.from('profiles').update({ name: data.user }).eq('id', user.id)
	revalidatePath('/account')
}