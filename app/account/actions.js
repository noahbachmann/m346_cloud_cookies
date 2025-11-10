'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@utils/supabase/server'

export async function updateUsername(data) {
	const userId = data.get('userId')
	const newName = data.get('username')
	const supabase = await createClient()

	await supabase.from('profiles').update({ name: newName }).eq('id', userId)
	revalidatePath('/account')
}