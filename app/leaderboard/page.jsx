import { createClient } from '@utils/supabase/server'

export default async function Leaderboard({}){
	const supabase = await createClient()

	const { data: users } = await supabase
		.from('profiles')
		.select('id, name, gameState(total_score)')
		.order('total_score', { foreignTable: 'gameState', ascending: false })
		.limit(10)

	console.log(users)

	return(
		<div>
			<p>Leaderboard page</p>
			{
				Object.values(users).map((user, index) => (
					<div key={ index }>
						<p>{ index + 1 }. { user.name }: { user.gameState.total_score }</p>
					</div>
				))
			}
		</div>
	)
}