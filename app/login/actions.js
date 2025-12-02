'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@utils/supabase/server'

export async function signup(formData, username){
	const supabase = await createClient()
	const { data, error } = await supabase.auth.signUp(formData)

	if (error) {
		redirect(`/error?message=${encodeURIComponent(error.message)}`)
	}

	const user = data.user
	if (user) {
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
					name: username,
					gameState_id: state[0].id
				}
			])
		revalidatePath('/', 'layout')
		redirect('/login/confirm/email')
	}
}

export async function login(formData) {
	const supabase = await createClient()
	const { error } = await supabase.auth.signInWithPassword(formData)

	if (error) {
		redirect(`/error?message=${encodeURIComponent(error.message)}`)
	}

	revalidatePath('/', 'layout')
	redirect('/')
}

export async function logout() {
	const supabase = await createClient()
	const { error } = await supabase.auth.signOut({ scope: 'local' })

	if (error) {
		redirect(`/error?message=${encodeURIComponent(error.message)}`)
	}

	revalidatePath('/', 'layout')
	redirect('/')
}

export async function resetPassword(data){
	const supabase = await createClient()

	await supabase.auth.resetPasswordForEmail(data.email, {
		redirectTo: 'https://m346cloudcookies.vercel.app/account/password/check',
	})
}

export async function changePassword(pw){
	const supabase = await createClient()
	await supabase.auth.updateUser({ password: pw })
}

export async function incrementScore(data) {
	const supabase = await createClient()
	const userId = data.user_id
	await supabase
		.from('gameState')
		.update({ score:data.score, highscore:data.highscore, upgrades:data.upgrades, clicks:data.clicks, self_clicks:data.self_clicks, highscore:data.highscore, total_score:data.total_score, prestige:data.prestige, last_update: new Date() })
		.eq('user_id', userId)
}