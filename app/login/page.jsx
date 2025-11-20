'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { login, signup } from './actions'

export default function Login() {
	const [isLogin, setIsLogin] = useState(true)

	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors } } = useForm()

	async function onSignUp(data){
		if (data.password !== data.password_confirm) {
			setError('password_confirm', { type: 'pattern', message: 'Passwords do not match' })
			return
		}
		const { username, ...cred } = data

		await signup(cred, username)
		reset()
	}

	async function onLogIn(data) {
		await login(data)
		reset()
	}

	return (
		(isLogin ?
			<div className="container container-form">
				<form className="flex-1 flex flex-col justify-evenly gap-5 p-10" onSubmit={ handleSubmit(onLogIn) }>
					<input
						className={ `${errors.email ? 'error' : ''}` }
						type="email" placeholder="Your email"
						{ ...register('email', { required: true, maxLength: 50 }) } />

					<input
						className={ `${errors.password ? 'error' : ''}` }
						type="password"
						placeholder="Your password"
						{ ...register('password', { required: true, maxLength: 50 }) } />

					<button className="button">Login</button>

					<p className="link text-[1rem]!" onClick={ () => setIsLogin(!isLogin) }>Create an account</p>
					<Link className="link font-normal! text-[1rem]!" href="/account/password">Forgot Password?</Link>
				</form>
			</div>
			:
			<div className="container container-form">
				<form className="flex-1 flex flex-col justify-evenly gap-5 p-10" onSubmit={ handleSubmit(onSignUp) }>
					<input
						className={ `${errors.email ? 'error' : ''}` }
						type="email" placeholder="Your email"
						{ ...register('email', { required: true, maxLength: 50, pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/ }) } />
					{ errors.email?.type === 'pattern' && <p className="text-red-500 text-sm">Please input a real e-mail.</p> }

					<input
						className={ `${errors.username ? 'error' : ''}` }
						type="string" placeholder="Your username"
						{ ...register('username', { required: true, maxLength: 20 }) } />

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

					<button className="button">Sign Up</button>

					<p className="link text-[1rem]!" onClick={ () => setIsLogin(!isLogin) }>Have an account? Log In</p>
					<Link className="link font-normal! text-[1rem]!" href="/account/password">Forgot Password?</Link>
				</form>
			</div>
		)

	)
}