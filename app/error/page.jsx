'use client'
import { useSearchParams } from 'next/navigation'

export default function ErrorPage() {
	const params = useSearchParams()
	const message = params.get('message')

	return (
		<div className="container container-form max-w-200! p-10!">
			<div className="flex flex-col text-center">
				<h2 className="font-bold!">Error</h2>
				<p>{message || 'An unexpected error occurred.'}</p>
			</div>
		</div>
	)
}