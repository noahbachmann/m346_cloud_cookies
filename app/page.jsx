import { createClient } from '@utils/supabase/server'
import GameClient from './components/gameClient'
import { redirect } from 'next/navigation'
import upgrades from './data/upgrades.json'

export default async function Home({ }) {
	const supabase = await createClient()

	const {
		data: { user },
		error
	} = await supabase.auth.getUser()

	if (error || !user) {
		redirect('/login')
	}

	const { data } = await supabase.from('gameState').select().eq('user_id', user.id).limit(1).single()
	const clicks = [data.upgrades.autoClicker*upgrades.autoClicker.increase, data.upgrades.cloudServer*upgrades.cloudServer.increase, data.upgrades.dataCenter*upgrades.dataCenter.increase, data.upgrades.aiAutomation*upgrades.aiAutomation.increase].reduce(((a,b)=>a+b))*(1 + data.upgrades.loadBalancer * upgrades.loadBalancer.increase) * Math.floor((new Date() - new Date(data.last_update)) / 1000)
	const score = Math.round(clicks * ((data.prestige*0.5)+1))

	data.score += score
	data.total_score += score
	data.highscore = Math.max(data.score, data.highscore)
	data.clicks += clicks

	return (
		<div className="container container-lg my-auto flex-1">
			<GameClient initialData={ data } />
		</div>
	)
}