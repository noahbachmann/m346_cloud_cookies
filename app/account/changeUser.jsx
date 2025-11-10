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
		<form className="flex" onSubmit={ handleSubmit(onSubmit) }>
			<p className="flex items-center gap-5">
				Username:
				<input
					className={ `${errors.user ? 'error' : ''}` }
					type="text"
					{ ...register('user', { required: true, maxLength: 50 }) } />

				<button className={currentName != savedUser ? 'button' : '' } disabled={currentName == savedUser}>Submit</button>
			</p>
		</form>
	)
}