'use client'
import { useRouter } from 'next/navigation'
import { changePassword } from '../../login/actions'
import { useForm } from 'react-hook-form'

export default function UpdatePassword(){
	const router = useRouter()

	const {
		register,
		handleSubmit,
		formState: { errors } } = useForm()

	async function onSubmit(data){
		if (data.password !== data.password_confirm) {
			setError('password_confirm', { type: 'pattern', message: 'Passwords do not match' })
			return
		}
		await changePassword(data.password)
		router.push('/account')
	}

	return(
		<div className="container container-form">
			<form className="w-full flex flex-col justify-evenly gap-5 p-10" onSubmit={ handleSubmit(onSubmit) }>
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

				<button className="button">Submit</button>
			</form>
		</div>
	)
}