import React from 'react'
import { NavBar } from './NavBar'

export const HomePage = () => {
  return (
    <>
    <NavBar/>
    <div>
        <h1 className='text-xl px-16 my-6'>DashBoard</h1>
    </div>
    <div><h1 className='text-center text-4xl font-semibold'>Welcome to Admin Panel</h1></div>
    </>
  )
}
