'use client'
import { useState, useEffect, useRef } from 'react'
import { incrementScore } from '../login/actions'

export default function GameClient({ initialData }) {

	const [data, setData] = useState(initialData)
	const dataRef = useRef(data)
	useEffect(() => {
		dataRef.current = data
	}, [data])

	useEffect(() => {
		const saveData = async () => {
			await incrementScore(dataRef.current)
		}

		const saveInterval = setInterval(() => {
			saveData()
		}, 60000)

		const idleInterval = setInterval(() => {
			const additionalClicks = [dataRef.current.upgrades.upgrade3, dataRef.current.upgrades.upgrade4*2, dataRef.current.upgrades.upgrade5*4, dataRef.current.upgrades.upgrade6*8, dataRef.current.upgrades.upgrade7*16].reduce(((a,b)=>a+b))
			const additionalScore = Math.round(additionalClicks*(dataRef.current.upgrades.upgrade8+1) * ((dataRef.current.prestige*0.5)+1))

			setData(prev => ({
				...prev,
				score: prev.score + additionalScore,
				highscore: Math.max(prev.score + additionalScore, prev.highscore),
				total_score: prev.total_score + additionalScore,
				clicks: prev.clicks + additionalClicks
			}))
		}, 1000)

		return () => {
			saveData()
			clearInterval(saveInterval)
			clearInterval(idleInterval)
		}
	}, [])

	function click() {
		const additionalClicks = 1 * (data.upgrades.upgrade1 + 1)
		const additionalScore = Math.round(additionalClicks * (data.upgrades.upgrade8+1) * ((dataRef.current.prestige*0.5)+1))
		setData(prev => ({
			...prev,
			score: prev.score + additionalScore,
			highscore: Math.max(prev.score + additionalScore, prev.highscore),
			total_score: prev.total_score + additionalScore,
			clicks: prev.clicks + additionalClicks,
			self_clicks: prev.self_clicks + additionalClicks
		}))
	}

	function buyUpgrade(upgrade, cost){
		if(data.score < cost) return
		setData(prev => ({
			...prev,
			score: prev.score - cost,
			upgrades: {
				...prev.upgrades,
				[upgrade]: prev.upgrades[upgrade] + 1
			}
		}))
	}

	function prestige(){
		const cost = data.prestige == 0 ? 1000000 : data.prestige * 5 * 1000000
		if(data.total_score < cost) return
		setData({
			...prev,
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
			prestige: prev.prestige + 1,
		})
	}

	return (
		<>
			<div>
				<p>left</p>
				<p>Points: {data.score}</p>
				<p>Points/s: {[data.upgrades.upgrade3, data.upgrades.upgrade4*2, data.upgrades.upgrade5*4, data.upgrades.upgrade6*8, data.upgrades.upgrade7*16].reduce(((a,b)=>a+b))}</p>
				<p>Click value: {data.upgrades.upgrade1+1}</p>
				<p>Total Clicks: {data.clicks}</p>
				<p>Manual Clicks: {data.self_clicks}</p>
				<p>Automated Clicks: {data.clicks - data.self_clicks}</p>
				<p>Total Points earned: {data.total_score}</p>
				<p>Most Points: {data.highscore}</p>
				<p>Upgrades purchased: {Object.values(data.upgrades).reduce((a,b) => a+b)}</p>
				<p>Prestige Stage: 0</p>
			</div>
			<div>
				<button onClick={ click }>Click Me</button>
			</div>
			<div>
				{
					Object.entries(data.upgrades).map(([upgrade, level], index) => {
						const cost = Math.floor(20 * (level+1) * Math.pow((index + 1),2))

						return (
							<div className="flex" key={ index }>
								<p>{ upgrade } - Level: { level }</p>
								<button onClick={ () => buyUpgrade(upgrade, cost) }>{ cost }</button>
							</div>
						)
					})
				}
				<div>
					<p>Prestige</p>
					<button onClick={ () => prestige() }>{ data.prestige == 0 ? 1000000 : data.prestige * 5 * 1000000 }</button>
				</div>
			</div>
		</>
	)
}