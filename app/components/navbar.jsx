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
					<div className="grid w-full px-12 md:px-24 lg:px-48 mt-14 lg:mt-28 grid-cols-3 md:grid-cols-4 gap-12 md:gap-24 lg:gap-48">
						<div className="hidden md:block">
							<p>prestige</p>
						</div>

						<div className="col-span-2 h-60 p-8 lg:p-16 flex justify-between items-center bg-primary rounded border-dark border-1">
							<Link className="flex items-center" href="/">
								<p className="hidden md:block text-white text-[1.5rem]! lg:text-[1.75rem]! font-bold">CloudClicker</p>
								<Image src="/vectors/cloud.svg" width="40" height="40" alt="cloud" />
							</Link>

							<Link className="bg-secondary px-8 md:px-16 py-4 rounded" href="/leaderboard">Leaderboard</Link>
						</div>

						<div className="max-w-100 lg:max-w-220 ms-auto h-60 px-8 md:gap-8 md:px-12 flex justify-between items-center bg-primary rounded border-dark border-1">
							<Link className="flex items-center gap-2" href="/account">
								<p className="hidden lg:block">{ user.name.substring(0,8) }</p>
								<Image src="/vectors/person.svg" width="35" height="35" alt="user" />
							</Link>

							<button className="bg-secondary px-6 py-7 rounded cursor-pointer" onClick={ handleLogout }>
								<Image src="/vectors/logout.svg" width="27" height="24" alt="logout"/>
							</button>
						</div>
					</div>
				) :
				(
					<div className="w-full px-12 md:px-48 mt-28 grid grid-cols-1 md:grid-cols-4">
						<div className="md:col-start-2 md:col-span-2 h-60 p-16 bg-primary flex justify-between items-center rounded border-dark border-1">
							<Link className="flex items-center" href="/">
								<p className="text-white text-[1.75rem]! font-bold">CloudClicker</p>
								<Image src="/vectors/cloud.svg" width="40" height="40" alt="cloud" />
							</Link>
						</div>
					</div>
				)
			}
		</>
	)
}