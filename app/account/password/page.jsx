'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { resetPassword } from '../../login/actions'

export default function PasswordReset({}){
	const [sent, setSent] = useState(false)

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors } } = useForm()

	async function onSubmit(data){
		await resetPassword(data)
		reset()
		setSent(true)
	}

	return(
			<div className="container container-form flex flex-col">
				<form className="flex-1 flex flex-col justify-evenly gap-5 p-10" onSubmit={ handleSubmit(onSubmit) }>
					<input
							className={ `${errors.email ? 'error' : ''}` }
							type="email" placeholder="E-Mail"
							{ ...register('email', { required: true, maxLength: 50 }) } />
					<button className="button">Submit</button>
				</form>
				{ sent ?
					<p>If your account is registered, you will receive an E-Mail to reset your password.</p>
					:
					<></>
				}
			</div>
	)
}