'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
		setError,
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

	async function onSubmit(data) {
		if (!isLogin && data.password !== data.password_confirm) {
			setError('password_confirm', { type: 'pattern', message: 'Passwords do not match' })
			return
		}
		await login(data, isLogin)
		reset()
	}

	if (checking) {
		return <p>Checking user...</p>
	}

	return (
		(isLogin ?
			<div className="container container-sm">
				<form className="flex-1 flex flex-col justify-evenly gap-5 p-10" onSubmit={ handleSubmit(onSubmit) }>
					<input
						className={ `${errors.email ? 'error' : ''}` }
						type="email" placeholder="Your email"
						{ ...register('email', { required: true, maxLength: 50 }) } />

					<input
						className={ `${errors.password ? 'error' : ''}` }
						type="password"
						placeholder="Your password"
						{ ...register('password', { required: true, maxLength: 50 }) } />

					<button className="button text-primary bg-secondary border-2 hover:border-accent hover:text-accent active:border-white active:text-white">Login</button>

					<p className="link" onClick={ () => setIsLogin(!isLogin) }>Create an account</p>
					<Link href="/account/password">Forgot Password?</Link>
				</form>
			</div>
			:
			<div className="container container-sm">
				<form className="flex-1 flex flex-col justify-evenly gap-5 p-10" onSubmit={ handleSubmit(onSubmit) }>
					<input
						className={ `${errors.email ? 'error' : ''}` }
						type="email" placeholder="Your email"
						{ ...register('email', { required: true, maxLength: 50, pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/ }) } />
					{ errors.email?.type === 'pattern' && <p className="text-red-500 text-sm">Please input a real e-mail.</p> }

					<input
						className={ `${errors.password ? 'error' : ''}` }
						type="password"
						placeholder="Your password"
						{ ...register('password', { required: true, maxLength: 50, pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/ }) } />
					{ errors.password?.type === 'pattern' && <p className="text-red-500 text-sm">Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.</p> }

					<input
						className={ `${errors.password_confirm ? 'error' : ''}` }
						type="password"
						placeholder="Confirm password"
						{ ...register('password_confirm', { required: true }) } />
					{ errors.password_confirm?.type === 'pattern' && <p className="text-red-500 text-sm">{ errors.password_confirm.message }</p> }

					<button className="button text-primary bg-secondary border-2 hover:border-accent hover:text-accent active:border-white active:text-white">Sign Up</button>

					<p className="link" onClick={ () => setIsLogin(!isLogin) }>Have an account? Log In</p>
					<Link href="/account/password">Forgot Password?</Link>
				</form>
			</div>
		)

	)
}