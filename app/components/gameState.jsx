
import { createClient } from '@utils/supabase/server'
import GameClient from './gameClient'

export default async function GameState({ }) {
	const supabase = await createClient()

	const {
		data: { user },
		error
	} = await supabase.auth.getUser()

	if (error || !user) {
		return <p>No user logged in</p>
	}

	const { data } = await supabase.from('gameState').select().eq('user_id', user.id).limit(1).single()
	/* data object:
	{
		id: 5,
		score: 0,
		upgrades: {
			upgrade1: 0,
			upgrade2: 0,
			upgrade3: 0,
			upgrade4: 0,
			upgrade5: 0,
			upgrade6: 0,
			upgrade7: 0,
			upgrade8: 0
		},
		user_id: 'some-uuid',
		clicks: 0,
		self_clicks: 0,
		last_update,
		highscore: 0,
		total_score: 0,
		prestige: 0
	} */
	return (
		<div className="flex justify-around">
			<GameClient initialData={ data } />
		</div>
	)
}