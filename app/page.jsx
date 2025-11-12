import { createClient } from '@utils/supabase/server'
import GameClient from './components/gameClient'
import upgrades from './data/upgrades.json'

export default async function Home({ }) {
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
		upgrades:{
			"clickBooster": 0,
			"autoClicker": 0,
			"cloudServer": 0,
			"dataCenter": 0,
			"aiAutomation": 0,
			"loadBalancer": 0,
			"dataComp": 0,
			"timeDilation": 0,
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
	const clicks = [data.upgrades.autoClicker*upgrades.autoClicker.increase, data.upgrades.cloudServer*upgrades.cloudServer.increase, data.upgrades.dataCenter*upgrades.dataCenter.increase, data.upgrades.aiAutomation*upgrades.aiAutomation.increase].reduce(((a,b)=>a+b))*(1 + data.upgrades.loadBalancer * upgrades.loadBalancer.increase) * Math.floor((new Date() - new Date(data.last_update)) / 1000)
	const score = Math.round(clicks * ((data.prestige*0.5)+1))

	data.score += score
	data.total_score += score
	data.highscore = Math.max(data.score, data.highscore)
	data.clicks += clicks

	return (
		<div className="container container-lg flex justify-around">
			<GameClient initialData={ data } />
		</div>
	)
}