import { NextResponse } from 'next/server'
import { createClient } from '@utils/supabase/server'

export async function GET(request) {
	const { searchParams } = new URL(request.url)

	const code = searchParams.get('code')
	const redirectTo = request.nextUrl.clone()
	redirectTo.searchParams.delete('code')

	if (code) {
		const supabase = await createClient()
		const { error } = await supabase.auth.exchangeCodeForSession(code)

		if (!error) {
			redirectTo.pathname = '/account/update'
			return NextResponse.redirect(redirectTo)
		}
	}
	redirectTo.pathname = '/error'
	return NextResponse.redirect(redirectTo)
}