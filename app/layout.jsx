import './globals.scss'
import { createClient } from '@utils/supabase/server'

import Navbar from './components/navbar.jsx'
import Footer from './components/footer.jsx'

export const metadata = {
	title: 'Cloud Cookies',
	description: 'Cookie Clicker Game in the Cloud with Supabase and Next.js',
}

export default async function RootLayout({ children }) {

	const supabase = await createClient()
	const { data: { user } } = await supabase.auth.getUser()
	return (
		<html lang="en">
			<body className="min-h-screen flex flex-col">
				<Navbar user={ user } />
				<main className="flex-1">
					{children}
				</main>
				<Footer />
			</body>
		</html>
	)
}
