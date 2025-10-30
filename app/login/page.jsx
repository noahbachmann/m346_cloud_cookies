'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { login } from './actions'
import { createClient } from '@utils/supabase/client'

export default function Login() {
	const router = useRouter()
	const [checking, setChecking] = useState(true)
	const [isLogin, setIsLogin] = useState(true)

	useEffect(() => {
		const checkUser = async () => {
			const supabase = createClient()
			const { data: { session } } = await supabase.auth.getSession()

			if (session?.user) {
				router.push('/account')
			} else {
				setChecking(false)
			}
		}
		checkUser()
	}, [])

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors } } = useForm()

	async function OnSubmit(data) {
		await login(data, isLogin)
		reset()
	}

	return (
		checking ?
			(<p>Checking user...</p>)
			:
			(
				<div className="container container-sm">
					<form className="flex-1 flex flex-col justify-evenly gap-5 p-10" onSubmit={handleSubmit(OnSubmit)}>
						<input
							className={`${errors.username ? 'error' : ''}`}
							type="email" placeholder="Your email"
							{...register('email', { required: true, maxLength: 50 })} />

						<input
							className={`${errors.password ? 'error' : ''}`}
							type="password"
							placeholder="Your password"
							{...register('password', { required: true, maxLength: 50 })} />

						<button className="button text-primary bg-secondary border-2 hover:border-accent hover:text-accent active:border-white active:text-white">{isLogin ? 'Login' : 'Sign Up'}</button>

						<p className="link" onClick={() => setIsLogin(!isLogin)}>
							{isLogin ? 'Create an account' : 'Have an account? Log In'}
						</p>
					</form>
				</div>
			)
	)
}