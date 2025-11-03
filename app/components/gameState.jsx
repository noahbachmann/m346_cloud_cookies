
import { createClient } from '@utils/supabase/server'

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
	} */
	return (
		<div className="flex justify-around">
			<div>
				<p>left</p>
				<p>{data.score}</p>
			</div>
			<div>
				<p>center</p>
			</div>
			<div>
				<p>right</p>
			</div>
		</div>
	)
}