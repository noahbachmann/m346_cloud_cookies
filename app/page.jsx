'use client'

import { useState } from 'react'
import Navbar from './components/navbar.jsx'
import Stats from './components/stats.jsx'
import Login from './components/login.jsx'

export default function Home() {
	const [page, setPage] = useState('stats')

	const renderPage = () => {
		switch (page) {
			case 'stats':
				return <Stats />
			case 'login':
				return <Login />
		}
	}

	return (
		<div className="flex flex-col min-h-screen items-center justify-center">
			<Navbar setPage={setPage} />
			<main className="flex min-h-screen w-full">
				{renderPage()}
			</main>
		</div>
	)
}
