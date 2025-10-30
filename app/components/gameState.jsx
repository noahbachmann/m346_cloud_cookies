
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

	const { data } = await supabase.from('gameState').select().eq('user_id', user.id).single()

	return (
		<div>
			<p>{data.score}</p>
		</div>
	)
}