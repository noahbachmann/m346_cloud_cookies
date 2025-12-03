'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { updateUsername } from './actions'

export default function ChangeUser({ initialName }){
	const [savedUser, setSavedUser] = useState(initialName)
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors }
	} = useForm({
		defaultValues: { user: initialName }
	})

	const currentName = watch('user')

	function onSubmit(data){
		setSavedUser(data.user)
		updateUsername(data)
	}

	return(
		<form className="flex flex-col gap-6" onSubmit={ handleSubmit(onSubmit) }>
			<div className="flex items-center justify-between gap-20">
				<p className="font-bold pr-20">Username:</p>
				<input
					className={ `${errors.user ? 'error' : ''} text-center max-w-150` }
					type="text"
					{ ...register('user', { required: true, maxLength: 12 }) } />
			</div>

			<button className={ currentName != savedUser ? 'button w-full' : 'hidden' } disabled={ currentName == savedUser }>Change Username</button>
		</form>
	)
}