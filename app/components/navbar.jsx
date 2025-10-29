import Link from 'next/link'

export default function Navbar({ }) {
	return (
		<div className="w-full h-30 bg-green-500">
			<Link href="/">Home</Link>
			<Link href="/login">Login</Link>
		</div>
	)
}