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

	const [boosting, setBoosting] = useState(false)
	const [prestigeCost, setPrestigeCost] = useState(data.prestige == 0 ? 1000000000 : data.prestige * 5 * 1000000000)

	useEffect(() => {
		const saveData = async() => {
			await incrementScore(dataRef.current)
		}

		const saveInterval = setInterval(() => {
			saveData()
		}, 20000)

		const idleInterval = setInterval(() => {
			const additionalClicks = [dataRef.current.upgrades.autoClicker*upgrades.autoClicker.increase, dataRef.current.upgrades.cloudServer*upgrades.cloudServer.increase, dataRef.current.upgrades.dataCenter*upgrades.dataCenter.increase, dataRef.current.upgrades.aiAutomation*upgrades.aiAutomation.increase].reduce(((a,b)=>a+b))*(1 + dataRef.current.upgrades.loadBalancer * upgrades.loadBalancer.increase)
			const additionalScore = additionalClicks* (1 + (dataRef.current.prestige) + (boosting ? dataRef.current.upgrades.timeDilation * upgrades.timeDilation.increase : 0))

			setData(prev => ({
				...prev,
				score: Math.round(prev.score + additionalScore),
				highscore: Math.round(Math.max(prev.score + additionalScore, prev.highscore)),
				total_score: Math.round(prev.total_score + additionalScore),
				clicks: Math.round(prev.clicks + additionalClicks)
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
		const additionalScore = additionalClicks *  (1 + (dataRef.current.prestige) + (boosting ? dataRef.current.upgrades.timeDilation * upgrades.timeDilation.increase : 0))
		setData(prev => ({
			...prev,
			score: Math.round(prev.score + additionalScore),
			highscore: Math.round(Math.max(prev.score + additionalScore, prev.highscore)),
			total_score: Math.round(prev.total_score + additionalScore),
			clicks: Math.round(prev.clicks + additionalClicks),
			self_clicks: Math.round(prev.self_clicks + additionalClicks)
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

	function startBoost(){
		if(boosting) return
		setBoosting(true)
		setTimeout(() => {
			setBoosting(false)
		}, 15000)
	}

	async function prestige(){
		if(data.score < prestigeCost) return
		setData(prev => ({
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
		}))
		setPrestigeCost(data.prestige * 5 * 1000000000)
	}

	function formatNumber(num) {
		if (num >= 1_000_000_000) {
			return (num / 1_000_000_000).toFixed(2).replace(/\.0$/, '') + 'b'
		} else if (num >= 1_000_000) {
			return (num / 1_000_000).toFixed(2).replace(/\.0$/, '') + 'm'
		} else if (num >= 1_000) {
			return (num / 1_000).toFixed(2).replace(/\.0$/, '') + 'k'
		} else {
			return num.toString()
		}
	}

	return (
		<div className="py-12 gap-8 flex flex-col md:flex-row justify-between">
			<div className="min-w-300 p-8 md:p-12 bg-primary rounded border-2 border-dark">
				<h3 className="mb-16">Statistics</h3>

				<div className="flex justify-between mb-5">
					<p className="font-bold">Points:</p>
					<p>{formatNumber(data.score)}</p>
				</div>
				<div className="flex justify-between mb-5">
					<p className="font-bold">Points/s:</p>
					<p>{formatNumber(
						[
							data.upgrades.autoClicker * upgrades.autoClicker.increase,
							data.upgrades.cloudServer * upgrades.cloudServer.increase,
							data.upgrades.dataCenter * upgrades.dataCenter.increase,
							data.upgrades.aiAutomation * upgrades.aiAutomation.increase
						].reduce((a, b) => a + b) *
						(1 + data.upgrades.loadBalancer * upgrades.loadBalancer.increase) *
						(1 + (data.prestige) + (boosting ? data.upgrades.timeDilation * upgrades.timeDilation.increase : 0))
					)}</p>
				</div>
				<div className="flex justify-between mb-16">
					<p className="font-bold">Click value:</p>
					<p>{formatNumber(data.upgrades.clickBooster + 1)}</p>
				</div>
				<div className="flex justify-between mb-5">
					<p className="font-bold">Total Clicks:</p>
					<p>{formatNumber(data.clicks)}</p>
				</div>
				<div className="flex justify-between mb-5">
					<p className="font-bold">Manual Clicks:</p>
					<p>{formatNumber(data.self_clicks)}</p>
				</div>
				<div className="flex justify-between mb-16">
					<p className="font-bold">Automated Clicks:</p>
					<p>{formatNumber(data.clicks - data.self_clicks)}</p>
				</div>
				<div className="flex justify-between mb-5">
					<p className="font-bold">Total Points earned:</p>
					<p>{formatNumber(data.total_score)}</p>
				</div>
				<div className="flex justify-between mb-5">
					<p className="font-bold">Most Points:</p>
					<p>{formatNumber(data.highscore)}</p>
				</div>
				<div className="flex justify-between mb-16">
					<p className="font-bold">Upgrades purchased:</p>
					<p>{Object.values(data.upgrades).reduce((a, b) => a + b)}</p>
				</div>
				<div className="flex justify-between">
					<p className="font-bold">Prestige Stage:</p>
					<p>{data.prestige}</p>
				</div>
			</div>
			<div className="self-center flex flex-col items-center gap-50">
				<div>
					<button onClick={ click }>Click Me</button>
				</div>
				<div className={ data.upgrades.timeDilation <= 0 ? 'hidden' : '' }>
					{
						boosting ?
							<button className="p-10 bg-secondary text-black/55" disabled>Boost</button>
							:
							<button className="p-10 bg-primary" onClick={ startBoost }>Boost</button>
					}
				</div>
			</div>

			<div className="min-w-300 p-12 bg-primary rounded border-2 border-dark">
				<h3 className="mb-16">Upgrades</h3>
				<div className="flex justify-between mb-6">
					<p>Name</p>
					<div className="flex text-center">
						<p className="w-70">Cost</p>
						<p className="px-4">Lvl</p>
					</div>
				</div>
				<hr className="w-full h-2 my-6"/>
				{
					Object.entries(data.upgrades).map(([upgrade, level], index) => {
						const upgradeData = upgrades[upgrade]
						const cost = Math.floor((upgradeData.cost * (level+1)) - (upgradeData.cost * (data.upgrades.dataComp * upgrades.dataComp.increase)))

						return (
							<div className="flex justify-between mb-6" key={ index }>
								<p className="font-bold">{ upgradeData.name }</p>
								<div className="flex">
								{
									upgradeData.name == 'Data Compression' && level > 0 ?
										<button className="button w-70" disabled>Max. Lvl</button>
										:
										<button className="button w-70" onClick={ () => buyUpgrade(upgrade, cost) }>{ formatNumber(cost) }</button>
								}
									<p className="min-w-35 text-[0.8rem] ml-4 px-8 py-6 rounded bg-black text-white text-end">{ level }</p>
								</div>
							</div>
						)
					})
				}
				<div className="flex justify-between">
					<p className="font-bold">Prestige</p>
					<div className="flex">
						<button className="button w-70" onClick={ () => prestige() }>{ formatNumber(prestigeCost) }</button>
						<p className="min-w-35 text-[0.8rem] ml-4 px-8 py-6 rounded bg-black text-white text-end">{ data.prestige }</p>
					</div>
				</div>
			</div>
		</div>
	)
}