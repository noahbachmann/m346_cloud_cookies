'use client'
import { useForm } from 'react-hook-form'

export default function Login() {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors } } = useForm()

	async function OnSubmit(data) {
		console.log(data)
		reset()
	}

	return (
		<form className="flex-1 flex flex-col justify-evenly" onSubmit={handleSubmit(OnSubmit)}>
			<input
				className={`${errors.username ? 'error' : ''}`}
				type="text" placeholder="Your username"
				{...register('username', { required: true, maxLength: 50 })} />

			<input
				className={`${errors.password ? 'error' : ''}`}
				type="password"
				placeholder="Your password"
				{...register('password', { maxLength: 50 })} />

			<button className="button text-primary bg-secondary border-2 hover:border-accent hover:text-accent active:border-white active:text-white">Login</button>
		</form>
	)
}