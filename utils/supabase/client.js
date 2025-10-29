import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
	return createBrowserClient(
		process.env.SUPABASE_DATABASE_SUPABASE_URL,
		process.env.SUPABASE_ANON_KEY
	)
}