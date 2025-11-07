'use client'
import { createClient } from '@utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function PasswordReset({}){
	const supabase = createClient()
	const router = useRouter()

	useEffect(() => {
		const checkUser = async () => {
			const { data: { user } } = await supabase.auth.getUser()
			if(user)
				router.push('/account/password/update')
		}
		checkUser()
	})
	const [sent, setSent] = useState(false)

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors } } = useForm()

	async function resetPassword(data){
		reset()
		setSent(true)
		await supabase.auth.resetPasswordForEmail(data.email, {
			redirectTo: 'http://localhost:3000//account/password/check',
		})
	}

	return(
		(!sent ?
			<div className="container container-sm">
				<form className="flex-1 flex flex-col justify-evenly gap-5 p-10" onSubmit={ handleSubmit(resetPassword) }>
					<input
							className={ `${errors.email ? 'error' : ''}` }
							type="email" placeholder="E-Mail"
							{ ...register('email', { required: true, maxLength: 50 }) } />
					<button>Submit</button>
				</form>
			</div>
			:
			<div className="container container-sm">
				<p>If your account is registered, you will receive an E-Mail to reset your password.</p>
			</div>
		)
	)
}