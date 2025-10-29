import { updateSession } from '@utils/supabase/proxy'
export async function proxy(request) {
	return await updateSession(request)
}
export const config = {
	matcher: [
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
}