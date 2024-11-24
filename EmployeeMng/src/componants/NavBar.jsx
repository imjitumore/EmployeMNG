import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
export const NavBar = ({setAdmin}) => {
    const admin= JSON.parse( localStorage.getItem("admin"))
    const [adminn,setAdminn] = useState("")
    const navigate = useNavigate()
    function logout()
    {
        const admin = localStorage.removeItem("admin")
        navigate("/")
        setAdminn(admin)  
    }
  
    

  return (
    <>
        <div className='flex justify-between px-20 py-4 font-semibold shadow-lg'>
            <ul className='flex gap-20 cursor-pointer'>
            <li><Link to={"/home"}>Home</Link></li>
            <li><Link to={"/employeeList"}>Employee List</Link></li>
            </ul>
            <ul className='flex gap-10 justify-center items-center'>
                <li className=''>{admin.admin.toUpperCase()}</li>
                <li className=' text-white bg-[red] px-4 py-1 rounded-md cursor-pointer' onClick={logout}>Logout</li>
            </ul>
        </div>
    </>
  )
}
