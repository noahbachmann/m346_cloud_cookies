'use client'
import { createClient } from '@utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

export default function UpdatePassword(){
	const router = useRouter()
	const supabase = createClient()

	useEffect(() => {
		const checkUser = async () => {
			const { data: { user } } = await supabase.auth.getUser()
			if(!user)
				return 'This user does not exist in our database.'
		}
		checkUser()
	})

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors } } = useForm()

	async function changePassword(pw){
		await supabase.auth.updateUser({ password: pw })
	}

	async function onSubmit(data){
		if (data.password !== data.password_confirm) {
			setError('password_confirm', { type: 'pattern', message: 'Passwords do not match' })
			return
		}
		await changePassword(data.password)
		reset()
		router.push('/account')
	}

	return(
		<form className="flex-1 flex flex-col justify-evenly gap-5 p-10" onSubmit={ handleSubmit(onSubmit) }>
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

			<button>Submit</button>
		</form>
	)
}