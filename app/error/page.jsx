'use client'
import { useSearchParams } from 'next/navigation'

export default function ErrorPage() {
	const params = useSearchParams()
	const message = params.get('message')

	return (
		<div>
			<h1>Error</h1>
			<p>{message || 'An unexpected error occurred.'}</p>
		</div>
	)
}