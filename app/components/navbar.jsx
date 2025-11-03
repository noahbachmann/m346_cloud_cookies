import Link from 'next/link'

import { logout } from '../login/actions'

export default function Navbar({ user }) {
	return (
		<div className="w-full h-30 bg-green-500">
			<Link href="/">Home</Link>

			{user ?
				(
					<>
						<Link href="/account">Account</Link>
						<button onClick={ logout }>Logout</button>
					</>
				) : (
					<Link href="/login">Login</Link>
				)
			}
		</div>
	)
}