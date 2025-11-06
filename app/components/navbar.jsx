'use client'
import Link from 'next/link'

export default function Navbar({ user }) {

	function handleLogout() {
		window.location.href = '/logout'
	}

	return (
		<div className="w-full h-30 bg-green-500">
			<Link href="/">Home</Link>

			{user ?
				(
					<>
						<Link href="/account">Account</Link>
						<button onClick={ handleLogout }>Logout</button>
					</>
				) : (
					<Link href="/login">Login</Link>
				)
			}
		</div>
	)
}