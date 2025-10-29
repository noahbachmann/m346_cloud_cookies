export default function Navbar({ setPage }) {
	return (
		<div className="w-full h-30 bg-green-500">
			<button onClick={() => setPage('stats')}>Stats</button>
			<button onClick={() => setPage('login')}>Login</button>
		</div>
	)
}