'use client'
import Image from 'next/image'
import Link from 'next/link'

export default function Navbar({ user }) {

	function handleLogout() {
		window.location.href = '/logout'
	}

	return (
		<>
			{ user ?
				(
					<div className="w-full px-48 mt-28 grid grid-cols-4 gap-48">
						<div>
							<p>prestige</p>
						</div>

						<div className="col-span-2 h-60 p-16 flex justify-between items-center bg-primary rounded border-dark border-1">
							<Link className="flex items-center" href="/">
								<p className="text-white text-[1.75rem]! font-bold">CloudClicker</p>
								<Image src="/vectors/cloud.svg" width="40" height="40" alt="cloud" />
							</Link>

							<div className="flex gap-8">
								<Link className="bg-secondary px-16 py-4 rounded" href="/leaderboard">Leaderboard</Link>
							</div>
						</div>

						<div className="max-w-250 h-60 px-12 flex justify-between items-center gap-12 bg-primary rounded border-dark border-1">
							<div className="flex gap-2">
								<Link href="/account">{ user.name }</Link>
								<Image src="/vectors/person.svg" width="35" height="35" alt="user" />
							</div>

							<button className="bg-secondary px-6 py-7 rounded cursor-pointer" onClick={ handleLogout }>
								<Image src="/vectors/logout.svg" width="27" height="24" alt="logout"/>
							</button>
						</div>
					</div>
				) :
				(
					<div className="w-full px-48 mt-28 grid grid-cols-4 gap-48">
						<div className="col-start-2 col-span-2 h-60 p-16 bg-primary flex justify-between items-center rounded border-dark border-1">
							<div className="flex items-center">
								<p className="text-white text-[1.75rem]! font-bold">CloudClicker</p>
								<Image src="/vectors/cloud.svg" width="40" height="40" alt="cloud" />
							</div>
						</div>
					</div>
				)
			}
		</>
	)
}