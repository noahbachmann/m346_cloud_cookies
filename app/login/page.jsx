'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { login } from './actions'
import { createClient } from '@utils/supabase/client'

export default function Login() {
	const [checking, setChecking] = useState(true)
	const [isLogin, setIsLogin] = useState(true)
	const router = useRouter()
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors } } = useForm()

	useEffect(() => {
		const checkUser = async () => {
			const supabase = createClient()
			const { data: { user } } = await supabase.auth.getUser()

			if (user) {
				router.push('/account')
			} else {
				setChecking(false)
			}
		}
		checkUser()
	}, [])

	async function OnSubmit(data) {
		await login(data, isLogin)
		reset()
	}

	if (checking) {
		return <p>Checking user...</p>
	}

	return (
		<div className="container container-sm">
			<form className="flex-1 flex flex-col justify-evenly gap-5 p-10" onSubmit={ handleSubmit(OnSubmit) }>
				<input
					className={ `${errors.email ? 'error' : ''}` }
					type="email" placeholder="Your email"
					{ ...register('email', { required: true, maxLength: 50, pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/ }) } />

				<input
					className={ `${errors.password ? 'error' : ''}` }
					type="password"
					placeholder="Your password"
					{ ...register('password', { required: true, maxLength: 50, pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/ }) } />
				{errors.password?.type === 'pattern' && <p className="text-red-500 text-sm">Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.</p>}

				<button className="button text-primary bg-secondary border-2 hover:border-accent hover:text-accent active:border-white active:text-white">{isLogin ? 'Login' : 'Sign Up'}</button>

				<p className="link" onClick={ () => setIsLogin(!isLogin) }>
					{isLogin ? 'Create an account' : 'Have an account? Log In'}
				</p>
			</form>
		</div>
	)
}