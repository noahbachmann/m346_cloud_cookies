import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
export async function updateSession(request) {
	let supabaseResponse = NextResponse.next({
		request,
	})
	const supabase = createServerClient(
		process.env.SUPABASE_URL,
		process.env.SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll()
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
					supabaseResponse = NextResponse.next({
						request,
					})
					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options)
					)
				},
			},
		}
	)
	// Do not run code between here
	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (
		!user &&
		!request.nextUrl.pathname.startsWith('/login') &&
		!request.nextUrl.pathname.startsWith('/auth') &&
		!request.nextUrl.pathname.startsWith('/error')
	) {
		const url = request.nextUrl.clone()
		url.pathname = '/login'
		return NextResponse.redirect(url)
	}

	return supabaseResponse
}