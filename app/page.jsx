import Navbar from './components/navbar.jsx'

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			<Navbar />
			<main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
				<h1>I am Main</h1>
			</main>
		</div>
	)
}
