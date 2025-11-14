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

	return (
		<div className="container container-form">
			<div className="flex flex-col gap-7">
				<div className="flex justify-between">
					<p className="font-bold">E-Mail:</p>
					<p>{ user.email }</p>
				</div>
				<ChangeUser initialName={ profile.name } />
				<Link className="button" href="/account/password/update">Change Password</Link>
			</div>
		</div>
	)
}