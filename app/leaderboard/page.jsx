import { createClient } from '@utils/supabase/server'

export default async function Leaderboard({}){
	const supabase = await createClient()

	const { data: users } = await supabase
		.from('profiles')
		.select('id, name, gameState(total_score)')
		.order('gameState(total_score)', { ascending: false })
		.limit(10)

	return(
		<div className="container container-sm flex flex-col gap-32">
			<h3 className="self-center">Top 10 Players</h3>
			<div className="relative px-36 py-40 bg-primary border-dark border-2 rounded">
				<div className="absolute top-[10%] justify-self-center h-[80%] w-6 bg-dark rounded"></div>
				
				<div className="flex justify-between pb-38">
					<div>User</div>
					<div>Score</div>
				</div>

				<div className="flex flex-col gap-12">
					{
						Object.values(users).map((user, index) => (
							<div className="flex justify-between" key={ index }>
								<p>{ index + 1 }. { user.name }</p>
								<p>{ user.gameState.total_score }</p>
							</div>
						))
					}
				</div>
			</div>
		</div>
	)
}