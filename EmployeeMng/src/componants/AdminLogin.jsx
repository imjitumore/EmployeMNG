import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
 const navigate = useNavigate()

  const notifySuccess = (msg) => {
    toast.success(`🦄 ${msg}`, {
      position: 'top-left',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  };

  const notifyError = (msg) => {
    toast.error(`🚨 ${msg}`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!username || !password) {
      notifyError('Username and password are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5500/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        notifyError(errorData.message || 'Invalid credentials.');
        return;
      }

      const data = await response.json();
      notifySuccess(data.message || 'Login successful!');
      localStorage.setItem('admin', JSON.stringify(data));
      navigate("/home")

    } catch (error) {
      console.error('Login request failed:', error);
      notifyError('An error occurred. Please try again later.');
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="text-center font-semibold text-4xl py-4">
        <h1>LOGIN PAGE</h1>
      </div>
      <div className="w-[40%] mx-auto h-full my-20">
        <p className="text-2xl font-extrabold">SIGN IN</p>
        <p className="text-[14px]">Insert your account information:</p>
        <div className="my-6">
          <form onSubmit={handleSubmit}>
            <div>
              <label className="font-semibold my-2" htmlFor="user">User Name</label>
              <input
                className="border-2 py-3 px-3 rounded-md text-sm w-full"
                type="text"
                id="user"
                placeholder="Enter Your UserName"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="my-5">
              <label className="font-semibold my-2" htmlFor="pass">Password</label>
              <input
                className="border-2 py-3 px-3 rounded-md text-sm w-full"
                type="password"
                id="pass"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                className="bg-[#2B5E5D] text-white w-full py-3 rounded-lg"
              >
                LOGIN
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
