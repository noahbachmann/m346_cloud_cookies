'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@utils/supabase/server'

export async function login(formData, login) {
	const supabase = await createClient()
	const { data, error } = login ? await supabase.auth.signInWithPassword(formData) : await supabase.auth.signUp(formData)

	if (error) {
		redirect('/error')
	}

	const user = data.user
	if (user && !login) {
		await supabase
			.from('gameState')
			.insert([
				{
					user_id: user.id,
				}
			])
	}

	revalidatePath('/', 'layout')
	redirect('/')
}

export async function logout() {
	const supabase = await createClient()
	const { error } = await supabase.auth.signOut({ scope: 'local' })

	if (error) {
		redirect('/error')
	}

	revalidatePath('/', 'layout')
	redirect('/')
}