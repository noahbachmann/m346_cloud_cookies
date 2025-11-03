'use client'
import { useState, useEffect, useRef } from 'react'
import { incrementScore } from '../login/actions'

export default function GameClient({ initialData }) {

	const [data, setData] = useState(initialData)
	const dataRef = useRef(data)
	useEffect(() => {
		dataRef.current = data
	}, [data])

	const idleInterval = setInterval(() => {
		const additionalClicks = [data.upgrades.upgrade3, data.upgrades.upgrade4*2, data.upgrades.upgrade5*4, data.upgrades.upgrade6*8, data.upgrades.upgrade7*16].reduce(((a,b)=>a+b))
		const additionalScore = additionalClicks*(data.upgrades.upgrade8+1)

		setData(prev => ({
			...prev,
			score: prev.score + additionalScore,
			highscore: Math.max(prev.score + additionalScore, prev.highscore),
			total_score: prev.total_score + additionalScore,
			clicks: prev.clicks + additionalClicks
		}))
	}, 1000)

	useEffect(() => {
		const saveData = async () => {
			console.log('saving data', dataRef.current)
			await incrementScore(dataRef.current)
		}

		const saveInterval = setInterval(() => {
			saveData()
		}, 60000)

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

	return (
		<>
			<div>
				<p>left</p>
				<p>Points: {data.score}</p>
				<p>Points/s: {data.score}</p>
				<p>Click value: {data.upgrades.upgrade1}</p>
				<p>Total Clicks: {data.clicks}</p>
				<p>Manual Clicks: {data.self_clicks}</p>
				<p>Automated Clicks: {data.clicks - data.self_clicks}</p>
				<p>Total Points earned: {data.total_score}</p>
				<p>Most Points: {data.highscore}</p>
				<p>Upgrades purchased: {Object.values(data.upgrades).reduce((a,b) => a+b)}</p>
			</div>
			<div>
				<button onClick={ click }>Click Me</button>
			</div>
			<div>
				<p>right</p>
			</div>
		</>
	)
}