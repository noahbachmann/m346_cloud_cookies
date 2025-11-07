import { redirect } from 'next/navigation'
import { createClient } from '@utils/supabase/server'
import Link from 'next/link'

export default async function Account() {

	const supabase = await createClient()
	const { data: { user }, error } = await supabase.auth.getUser()
	const { data: profile } = await supabase
		.from('profiles')
		.select('name')
		.eq('id', user?.id)
		.single()

	if (error || !user) {
		redirect('/login')
	}

	return (
		<>
			<p>E-Mail: { user.email }</p>
			<p>Username: { profile.name }</p>
			<Link href="/account/password/update">Change Password</Link>
		</>
	)
}