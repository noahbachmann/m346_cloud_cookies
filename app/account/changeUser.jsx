'use client'

import { useForm } from 'react-hook-form'
import { updateUsername } from './actions'

export default function ChangeUser({ initialName }){
	const {
		register,
		handleSubmit,
		formState: { errors } } = useForm()

	return(
		<form className="flex" onSubmit={ handleSubmit(updateUsername) }>
			<p className="flex items-center gap-5">
				Username:
				<input
					className={ `${errors.user ? 'error' : ''}` }
					type="text" value={ initialName }
					{ ...register('user', { required: true, maxLength: 50 }) } />
				<button>Submit</button>
			</p>
		</form>
	)
}