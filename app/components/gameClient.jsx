'use client'
import { useState, useEffect, useRef } from 'react'
import { incrementScore } from '../login/actions'
import upgrades from '../data/upgrades.json'

export default function GameClient({ initialData }) {

	const [data, setData] = useState(initialData)
	const dataRef = useRef(data)
	useEffect(() => {
		dataRef.current = data
	}, [data])

	const [prestigeCost, setPrestigeCost] = useState(initialData.prestige == 0 ? 1000000000 : initialData.prestige * 5 * 1000000000)

	useEffect(() => {
		const saveData = async () => {
			await incrementScore(dataRef.current)
		}

		const saveInterval = setInterval(() => {
			saveData()
		}, 60000)

		const idleInterval = setInterval(() => {
			const additionalClicks = [dataRef.current.upgrades.autoClicker*upgrades.autoClicker.increase, dataRef.current.upgrades.cloudServer*upgrades.cloudServer.increase, dataRef.current.upgrades.dataCenter*upgrades.dataCenter.increase, dataRef.current.upgrades.aiAutomation*upgrades.aiAutomation.increase].reduce(((a,b)=>a+b))*(1 + dataRef.current.upgrades.loadBalancer * upgrades.loadBalancer.increase)
			const additionalScore = Math.round(additionalClicks* ((dataRef.current.prestige*0.5)+1))

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
		const additionalClicks = 1 * (data.upgrades.clickBooster + 1)
		const additionalScore = Math.round(additionalClicks * ((dataRef.current.prestige*0.5)+1))
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
		cost = cost - Math.floor(cost * (data.upgrades.dataComp * upgrades.dataComp.increase))
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
		if(data.score < prestigeCost) return
		setData({
			...prev,
			score: 0,
			upgrades: {
				clickBooster: 0,
				autoClicker: 0,
				cloudServer: 0,
				dataCenter: 0,
				aiAutomation: 0,
				loadBalancer: 0,
				dataComp: 0,
				timeDilation: 0,
			},
			prestige: prev.prestige + 1,
		})
		setPrestigeCost(data.prestige * 5 * 1000000000)
	}

	function formatNumber(num) {
		if (num >= 1_000_000_000) {
			return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'b'
		} else if (num >= 1_000_000) {
			return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm'
		} else if (num >= 1_000) {
			return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k'
		} else {
			return num.toString()
		}
	}

	return (
		<>
			<div>
				<p>left</p>
				<p>Points: {formatNumber(data.score)}</p>
				<p>Points/s: {formatNumber([data.upgrades.autoClicker*upgrades.autoClicker.increase, data.upgrades.cloudServer*upgrades.cloudServer.increase, data.upgrades.dataCenter*upgrades.dataCenter.increase, data.upgrades.aiAutomation*upgrades.aiAutomation.increase].reduce(((a,b)=>a+b))*(1 + data.upgrades.loadBalancer * upgrades.loadBalancer.increase))}</p>
				<p>Click value: {formatNumber(data.upgrades.clickBooster+1)}</p>
				<p>Total Clicks: {formatNumber(data.clicks)}</p>
				<p>Manual Clicks: {data.self_clicks}</p>
				<p>Automated Clicks: {data.clicks - data.self_clicks}</p>
				<p>Total Points earned: {formatNumber(data.total_score)}</p>
				<p>Most Points: {formatNumber(data.highscore)}</p>
				<p>Upgrades purchased: {Object.values(data.upgrades).reduce((a,b) => a+b)}</p>
				<p>Prestige Stage: 0</p>
			</div>

			<div>
				<button onClick={ click }>Click Me</button>
			</div>

			<div>
				{
					Object.entries(data.upgrades).map(([upgrade, level], index) => {
						const upgradeData = upgrades[upgrade]
						const cost = Math.floor(upgradeData.cost * (level+1))

						return (
							<div className="flex" key={ index }>
								<p>{ upgradeData.name } - Level: { level }</p>
								{
									upgradeData.name == 'Data Compression' && level > 0 ?
										<button disabled>Max. Level</button>
										:
										<button onClick={ () => buyUpgrade(upgrade, cost) }>{ formatNumber(cost) }</button>
								}
							</div>
						)
					})
				}
				<div>
					<p>Prestige</p>
					<button onClick={ () => prestige() }>{ formatNumber(prestigeCost) }</button>
				</div>
			</div>
		</>
	)
}