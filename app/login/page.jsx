'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { login } from './actions'

export default function Login() {
	const [isLogin, setIsLogin] = useState(true)
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
}