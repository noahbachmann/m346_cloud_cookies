export default function Footer({ }) {
	return (
		<div className="w-full h-80 py-4 px-8 md:px-20 lg:px-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-dark text-white">
			<div className="*:text-[0.75rem]/15! flex flex-col justify-center">
				<p>©2025 CloudClicker</p>
				<p>Created by: Noah Bachmann and Paul Willimann</p>
				<p>Made with ❤️ using NextJS and Supabase</p>
			</div>
		</div>
	)
}