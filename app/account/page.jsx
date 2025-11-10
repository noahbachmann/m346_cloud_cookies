import ChangeUser from './changeUser'
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
	const name = profile.name
	console.log(name)
	return (
		<>
			<p>E-Mail: { user.email }</p>
			<ChangeUser initalName={ name } />
			<Link href="/account/password/update">Change Password</Link>
		</>
	)
}