'use client'
import { useState, useEffect, useRef } from 'react'
import { incrementScore, revalidateHome } from '../login/actions'
import upgrades from '../data/upgrades.json'
import Image from 'next/image'

export default function GameClient({ initialData }) {
	const [data, setData] = useState(initialData)
	const dataRef = useRef(data)
	const [boosting, setBoosting] = useState(false)
	const [prestigeCost, setPrestigeCost] = useState(data.prestige == 0 ? 1000000000 : data.prestige * 5 * 1000000000)

	useEffect(() => {
		const onPopState = () => {
			window.location.reload()
		}
		window.addEventListener('popstate', onPopState)
	}, [])

	async function saveData(newData = null) {
		await incrementScore(newData ? newData : dataRef.current)
	}

	useEffect(() => {
		dataRef.current = data
	}, [data])

	useEffect(() => {
		const saveInterval = setInterval(() => {
			saveData()
		}, 30000)

		const idleInterval = setInterval(() => {
			const additionalClicks = [dataRef.current.upgrades.autoClicker * upgrades.autoClicker.increase, dataRef.current.upgrades.cloudServer * upgrades.cloudServer.increase, dataRef.current.upgrades.dataCenter * upgrades.dataCenter.increase, dataRef.current.upgrades.aiAutomation * upgrades.aiAutomation.increase].reduce(((a, b) => a + b)) * (1 + dataRef.current.upgrades.loadBalancer * upgrades.loadBalancer.increase)
			const additionalScore = additionalClicks * (1 + (dataRef.current.prestige) + (boosting ? dataRef.current.upgrades.timeDilation * upgrades.timeDilation.increase : 0))

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
			clearInterval(idleInterval)
			clearInterval(saveInterval)
		}
	}, [])

	function click() {
		const additionalClicks = Math.max(1, (upgrades.clickBooster.increase * dataRef.current.upgrades.clickBooster))
		const additionalScore = additionalClicks * (1 + (dataRef.current.prestige) + (boosting ? dataRef.current.upgrades.timeDilation * upgrades.timeDilation.increase : 0))
		setData(prev => ({
			...prev,
			score: Math.round(prev.score + additionalScore),
			highscore: Math.round(Math.max(prev.score + additionalScore, prev.highscore)),
			total_score: Math.round(prev.total_score + additionalScore),
			clicks: Math.round(prev.clicks + additionalClicks),
			self_clicks: Math.round(prev.self_clicks + additionalClicks)
		}))
	}

	function buyUpgrade(upgrade, cost) {
		if (data.score < cost) return
		const newData = {
			...data,
			score: data.score - cost,
			upgrades: {
				...data.upgrades,
				[upgrade]: data.upgrades[upgrade] + 1
			}
		}
		setData(newData)
		saveData(newData)
	}

	function startBoost() {
		if (data.upgrades.timeDilation <= 0 || boosting) return

		setBoosting(true)
		setTimeout(() => {
			setBoosting(false)
		}, 15000)
	}

	function prestige() {
		if (data.score < prestigeCost) return

		const newData = {
				...data,
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
				prestige: data.prestige + 1,
			}
		setData(newData)
		saveData(newData)
		setPrestigeCost(newData.prestige * 5 * 1000000000)
		revalidateHome()
	}

	function formatNumber(num) {
		if (num >= 1_000_000_000_000_000) {
			return (num / 1_000_000_000_000_000).toFixed(2).replace(/\.0$/, '') + 'q'
		} else if (num >= 1_000_000_000_000) {
			return (num / 1_000_000_000_000).toFixed(2).replace(/\.0$/, '') + 't'
		} else if (num >= 1_000_000_000) {
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
		<div className="py-48 xl:py-0 grid grid-cols-11">
			<div className="col-span-full md:col-span-4 w-full md:max-w-300 xl:max-w-350 md:col-span-1 p-8 md:p-12 flex flex-col gap-5 xl:gap-10 bg-primary rounded border-2 border-dark">
				<h3 className="mb-12">Statistics</h3>

				<div className="flex justify-between">
					<p className="font-bold">Points:</p>
					<p>{formatNumber(data.score)}</p>
				</div>
				<div className="flex justify-between">
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
				<div className="flex justify-between mb-12">
					<p className="font-bold">Click value:</p>
					<p>{formatNumber(1 + Math.max(((upgrades.clickBooster.increase * data.upgrades.clickBooster) - 1), 0))}</p>
				</div>
				<div className="flex justify-between">
					<p className="font-bold">Total Clicks:</p>
					<p>{formatNumber(data.clicks)}</p>
				</div>
				<div className="flex justify-between">
					<p className="font-bold">Manual Clicks:</p>
					<p>{formatNumber(data.self_clicks)}</p>
				</div>
				<div className="flex justify-between mb-12">
					<p className="font-bold">Automated Clicks:</p>
					<p>{formatNumber(data.clicks - data.self_clicks)}</p>
				</div>
				<div className="flex justify-between">
					<p className="font-bold">Total Points earned:</p>
					<p>{formatNumber(data.total_score)}</p>
				</div>
				<div className="flex justify-between">
					<p className="font-bold">Most Points:</p>
					<p>{formatNumber(data.highscore)}</p>
				</div>
				<div className="flex justify-between mb-12">
					<p className="font-bold">Upgrades purchased:</p>
					<p>{Object.values(data.upgrades).reduce((a, b) => a + b)}</p>
				</div>
				<div className="flex justify-between mb-4">
					<p className="font-bold">Prestige Stage:</p>
					<p>{data.prestige}</p>
				</div>
				<div className="flex w-full">
					<button className="button flex justify-between w-full" onClick={ () => prestige() }><p>Prestige lvl. {data.prestige + 1}</p><p>{formatNumber(prestigeCost)}</p></button>
				</div>
			</div>
			<div className="col-span-full md:col-span-3 self-center flex flex-col items-center py-40 gap-50">
				<div className="flex">
					<button className="flex items-center justify-center size-164 bg-[#BFBFBF] rounded-[50%] border-1 border-[#676767] click shadow-bottom-right" onClick={ click }><Image src="/vectors/ClickCursor.svg" width="104" height="104" alt="cloud" /></button>
				</div>
				<div>
					{
						data.upgrades.timeDilation > 0 ?
							(
								boosting ?
									<button className="py-2 px-16 scale-120 bg-secondary rounded-xl border-2 border-dark animate-pulse" disabled>Boost</button>
									:
									<button className="py-2 px-16 bg-primary rounded-xl border-2 border-dark button-boost opacity-60" onClick={ startBoost }>Boost</button>
							)
							:
							<></>
					}
				</div>
			</div>

			<div className="col-span-full md:col-span-4 justify-self-end w-full md:max-w-300 xl:max-w-350 md:col-span-1 p-12 bg-primary rounded border-2 border-dark">
				<h3 className="mb-16 text-end">Upgrades</h3>
				<div className="flex justify-between mb-6">
					<p>Name</p>
					<div className="flex text-center">
						<p className="w-70">Cost</p>
						<p className="px-4">Lvl</p>
					</div>
				</div>
				<hr className="w-full h-2 mb-20 rounded" />
				{
					Object.entries(data.upgrades).map(([upgrade, level], index) => {
						const upgradeData = upgrades[upgrade]
						const cost = Math.floor((upgradeData.cost * (level + 1)) - (upgradeData.cost * (data.upgrades.dataComp * upgrades.dataComp.increase)))

						return (
							<div className="flex justify-between mb-6 xl:mb-10" key={ index }>
								<div className="group relative">
									<div className="absolute hidden p-6 bg-dark rounded text-white top-20 -left-50 w-200 text-center group-hover:block z-50">
										<p className="">{ upgradeData.description }</p>
									</div>
									<p className="font-bold">{upgradeData.name}</p>
								</div>
								<div className="flex">
									{
										upgradeData.name == 'Data Compression' && level > 0 ?
											<button className="button w-70" disabled>Max. Lvl</button>
											:
											<button className="button w-70 rounded" onClick={ () => buyUpgrade(upgrade, cost) }>{formatNumber(cost)}</button>
									}
									<p className="min-w-35 text-[0.8rem] ml-4 px-8 py-6 rounded bg-dark text-white text-center">{ level }</p>
								</div>
							</div>
						)
					})
				}
			</div>
		</div>
	)
}