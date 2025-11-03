
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

	const { data } = await supabase.from('gameState').select().eq('user_id', user.id).limit(1).single()
	const clicks = [data.upgrades.upgrade3, data.upgrades.upgrade4*2, data.upgrades.upgrade5*4, data.upgrades.upgrade6*8, data.upgrades.upgrade7*16].reduce(((a,b)=>a+b)) * Math.floor((new Date() - new Date(data.last_update)) / 1000)
	data.score += Math.floor(clicks * (data.upgrades.upgrade8+1) * ((data.prestige*0.5)+1))

	return (
		<div className="flex justify-around">
			<GameClient initialData={ data } />
		</div>
	)
}