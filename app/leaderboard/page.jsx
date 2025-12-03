import { createClient } from '@utils/supabase/server'

export default async function Leaderboard({ }) {
	const supabase = await createClient()

	const { data: users } = await supabase
		.from('profiles')
		.select('id, name, gameState(total_score)')
		.order('gameState(total_score)', { ascending: false })
		.limit(10)

	function formatNumber(num) {
		if (num >= 1_000_000_000_000_000) {
			return (num / 1_000_000_000_000_000).toFixed(2).replace(/\.0$/, '') + 'q'
		} else if (num >= 1_000_000_000_000) {
			return (num / 1_000_000_000_000).toFixed(2).replace(/\.0$/, '') + 't'
		} else if (num >= 1_000_000_000) {
			return (num / 1_000_000_000).toFixed(2).replace(/\.0$/, '') + 'b'
		} else if (num >= 1_000_000) {
			return (num / 1_000_000).toFixed(2).replace(/\.0$/, '') + 'm'
		} else if (num >= 1_000) {
			return (num / 1_000).toFixed(2).replace(/\.0$/, '') + 'k'
		} else {
			return num.toString()
		}
	}

	return (
		<div className="container container-sm px-0! py-32 xl:py-0 flex flex-col gap-16">
			<h3 className="self-center font-bold! text-[2.2rem]!">Top 10 Players</h3>
			<div className="relative px-10 md:px-36 py-38 bg-primary border-dark border-2 md:rounded">
				<div className="hidden md:block absolute top-[10%] justify-self-center h-[80%] w-6 bg-dark rounded"></div>

				<div className="flex justify-between pb-50 font-bold *:text-[1.4rem]!">
					<p>User</p>
					<p>Score</p>
				</div>

				<div className="flex flex-col gap-20 font-semibold">
					{
						Object.values(users).map((user, index) => (
							<div className="flex justify-between *:text-[1.4rem]!" key={ index }>
								<p>{index + 1}. {user.name}</p>
								<p>{formatNumber(user.gameState.total_score)}</p>
							</div>
						))
					}
				</div>
			</div>
		</div>
	)
}