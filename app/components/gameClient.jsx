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
			console.log('saving data', dataRef.current)
			await incrementScore(dataRef.current)
		}

		const saveInterval = setInterval(() => {
			saveData()
		}, 60000)

		const idleInterval = setInterval(() => {
			const additionalClicks = [dataRef.current.upgrades.upgrade3, dataRef.current.upgrades.upgrade4*2, dataRef.current.upgrades.upgrade5*4, dataRef.current.upgrades.upgrade6*8, dataRef.current.upgrades.upgrade7*16].reduce(((a,b)=>a+b))
			const additionalScore = additionalClicks*(dataRef.current.upgrades.upgrade8+1)

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
		const additionalScore = additionalClicks * (data.upgrades.upgrade8+1)
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
				<p>Prestige Stage: 0</p>
				<p>Upgrades purchased: {Object.values(data.upgrades).reduce((a,b) => a+b)}</p>
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
			</div>
		</>
	)
}