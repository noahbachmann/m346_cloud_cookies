import './globals.scss'
import { createClient } from '@utils/supabase/server'
import { Analytics } from '@vercel/analytics/next'

import Navbar from './components/navbar.jsx'
import Footer from './components/footer.jsx'

export const metadata = {
	title: 'Cloud Cookies',
	description: 'Cookie Clicker Game in the Cloud with Supabase and Next.js',
}

export default async function RootLayout({ children }) {

	const supabase = await createClient()
	const { data: { user } } = await supabase.auth.getUser()
	const profile = user ? await supabase.from('profiles').select().eq('id', user.id).limit(1).single() : null
	const prestige = user ? await supabase.from('gameState').select('prestige').eq('user_id', user.id).limit(1).single() : null
	return (
		<html lang="en">
			<body className="min-h-screen flex flex-col background-img">
				<Navbar user={ profile?.data } prestige={ prestige?.data.prestige } />
				<main className="flex flex-1 *:my-auto *:flex-1">
					{children}
				</main>
				<Footer />
			</body>
			<Analytics />
		</html>
	)
}
