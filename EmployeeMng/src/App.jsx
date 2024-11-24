import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { AdminLogin } from './componants/AdminLogin'
import {BrowserRouter,Navigate,Route,Routes} from 'react-router-dom'
import { HomePage } from './componants/HomePage'
import { EmployeeList } from './componants/EmployeeList'
import { NavBar } from './componants/NavBar'

function App() {

  const [admin, setAdmin] = useState("");

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem('admin'));
    setAdmin(storedAdmin);
  }, []);

  console.log("Admin:", admin);

  return (
    <>
        <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<AdminLogin />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={ <HomePage />}
          />
         
          <Route
            path="/employeeList"
            element={<EmployeeList />}
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
