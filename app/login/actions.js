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
		const { data: state } = await supabase
			.from('gameState')
			.insert([
				{
					user_id: user.id,
				}
			])
			.select('id')

		await supabase
			.from('profiles')
			.insert([
				{
					id: user.id,
					name: user.email.split('@')[0],
					gameState_id: state[0].id
				}
			])
		revalidatePath('/', 'layout')
		redirect('/login/confirm/email')
	}
	else {
		revalidatePath('/', 'layout')
		redirect('/')
	}
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

export async function incrementScore(data) {
	const supabase = await createClient()
	const userId = data.user_id
	await supabase
		.from('gameState')
		.update({ score:data.score, highscore:data.highscore, upgrades:data.upgrades, clicks:data.clicks, self_clicks:data.self_clicks, highscore:data.highscore, total_score:data.total_score, prestige:data.prestige, last_update: new Date() })
		.eq('user_id', userId)
}