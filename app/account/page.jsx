import ChangeUser from './changeUser'
import { createClient } from '@utils/supabase/server'
import Link from 'next/link'

export default async function Account() {

	const supabase = await createClient()
	const { data: { user } } = await supabase.auth.getUser()
	const { data: profile } = await supabase
		.from('profiles')
		.select('name')
		.eq('id', user?.id)
		.single()

	return (
		<div className="container container-form">
			<div className="flex flex-col gap-7">
				<div className="flex justify-between">
					<p className="font-bold">E-Mail:</p>
					<p>{ user.email }</p>
				</div>
				<ChangeUser initialName={ profile.name } />
				<Link className="button" href="/account/update">Change Password</Link>
			</div>
		</div>
	)
}