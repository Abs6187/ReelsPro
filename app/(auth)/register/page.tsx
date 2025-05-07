"use client"

import React from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';



const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8, {message: "Password must be at least 8 characters long"}),
})

const RegisterPage = () => {

    const { register, handleSubmit,  formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    const router = useRouter()

    const onSubmit = async (data : z.infer<typeof schema>) => {
        try {
          const response =  await axios.post("/api/auth/register", data)
          router.push("/login")

          console.log(response.data)
          
        } catch (error) {
            console.log(error)
    }  
    } 

    

  return (
    <div className='flex flex-col gap-4 min-h-screen max-w-7xl mx-auto px-4 pt-20 items-center justify-center'>
        <h1 className='bg-gradient-to-r from-blue-200 to-blue-700 bg-clip-text text-transparent text-3xl md:text-6xl'>Join Us</h1>
        <h1 className="text-3xl  font-semibold bg-gradient-to-r from-blue-200 to-blue-700 bg-clip-text text-transparent tracking-tight "> Welcome to <span className='text-white'>Reels</span>
                        <span className='text-blue-700'>Pro</span>
        </h1>
       <form className='flex flex-col gap-4 p-4 pb-0' onSubmit={handleSubmit(onSubmit)} >
            <label htmlFor="email" className='text-white'>Email</label>
            <label className="input input-bordered flex items-center gap-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70 text-blue-700">
                <path
                d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path
                d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input type="text" className="grow text-white"  {...register("email")}/>
            </label>
            {errors.email && <p className='text-red-500'>{errors.email.message}</p>}


            
            <label htmlFor="password" className='text-white'>Password</label>
            <label className="input input-bordered flex items-center gap-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70 text-blue-700">
                <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd" />
            </svg>
            <input 
                type="password"
                className="grow text-white"
                {...register("password")} />
            </label>

            {errors.password && <p className='text-red-500'>{errors.password.message}</p>}

            <button type='submit' className='btn btn-active'>Register</button>
       </form>
       <div className='flex gap-2'>
         < p className='text-white'> Already have an account?</p>
         <Link href="/login"  className='text-blue-700'>Login</Link>
       </div>
    </div>
  )
}

export default RegisterPage
