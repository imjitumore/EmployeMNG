import React, { useEffect, useState } from "react";
import { NavBar } from "./NavBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export const EmployeeList = () => {
  const notifySuccess = (msg) => {
    toast.success(`🦄 ${msg}`, {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const notifyError = (msg) => {
    toast.error(`🚨 ${msg}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const [val, setVal] = useState(true);
  const [vall, setVall] = useState(true);
  const [emp, setaEmp] = useState([]);
  const [searchEmp, setSearchEmp] = useState([]);
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    courses: [],
    image: null,
  });

  useEffect(() => {
    fetch("http://localhost:5500/api/employees")
      .then((resp) => resp.json())
      .then((data) => {
        if (data.employees) {
          setaEmp(data.employees);
        }
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  }, [emp]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        courses: checked
          ? [...prev.courses, value]
          : prev.courses.filter((course) => course !== value),
      }));
    } else if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const postData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "courses") {
        value.forEach((course) => postData.append(key, course));
      } else {
        postData.append(key, value);
      }
    });

    fetch("http://localhost:5500/api/employee", {
      method: "POST",
      body: postData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.message == "Employee created successfully!") {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
        setVal(true);
      })
      .catch((error) => {
        console.error("Error submitting employee data:", error);
        alert("Failed to submit employee data.");
      });

    setFormData({
      name: "",
      email: "",
      mobile: "",
      designation: "",
      gender: "",
      courses: [], // Reset the courses array
      image: null, // Reset the image file
    });
  };

  function handleDelete(id) {
    console.log(id);
    fetch(`http://localhost:5500/api/removeEmployee/${id}`, {
      method: "DELETE",
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.message === "Employee deleted successfully!") {
          setaEmp((prevEmp) => prevEmp.filter((item) => item.id !== id));
        } else {
          alert(data.message); // Handle any errors
        }
      })
      .catch((error) => {
        console.error("Error deleting employee:", error);
        alert("Failed to delete employee.");
      });
  }

  const [filteredEmp, setFilteredEmp] = useState([]);

  const searchEmployee = () => {
    if (!searchEmp.trim()) {
      alert("Please enter a search term.");
      return;
    }

    fetch(`http://localhost:5500/api/searchEmployee?query=${searchEmp}`)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.employees) {
          setFilteredEmp(data.employees);
        } else {
          alert(data.message || "No results found.");
          setFilteredEmp([]);
        }
      })
      .catch((error) => {
        console.error("Error searching employees:", error);
        alert("Failed to fetch search results.");
      });
  };


  const handleEdit = (id) => {
    const employee = emp.find((item) => item._id === id);
    if (employee) {
      setFormData({
        name: employee.name,
        email: employee.email,
        mobile: employee.mobile,
        designation: employee.designation,
        gender: employee.gender,
        courses: employee.courses,
        image: null, // Images won't be editable in this example
      });
      setEditEmployeeId(id);
      setIsEditMode(true);
      setVal(false); // Show the form
    }
  };
  
  const handleUpdate = (e) => {
    e.preventDefault();
  
    const updateData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "courses") {
        value.forEach((course) => updateData.append(key, course));
      } else {
        updateData.append(key, value);
      }
    });
  
    fetch(`http://localhost:5500/api/updateEmployee/${editEmployeeId}`, {
      method: "PUT",
      body: updateData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Employee updated successfully!") {
          toast.success(data.message);
          setaEmp((prevEmp) =>
            prevEmp.map((item) =>
              item._id === editEmployeeId ? { ...item, ...formData } : item
            )
          );
          setIsEditMode(false);
          setEditEmployeeId(null);
          setVal(true);
        } else {
          toast.error(data.message);
        }
      })
      .catch((error) => {
        console.error("Error updating employee:", error);
        alert("Failed to update employee data.");
      });
  
    setFormData({
      name: "",
      email: "",
      mobile: "",
      designation: "",
      gender: "",
      courses: [],
      image: null,
    });
  };
  


  return (
    <>
      <ToastContainer />
      <NavBar />
      <div>
        <h1 className="text-xl px-16 my-6">Employee List</h1>
      </div>

      <div>
        <div className="flex justify-end px-20 gap-32 items-center">
        <p>Total Count : <span className="font-bold">{emp.length}</span></p>
          <button
            className="bg-[#0eb250] px-4 py-2 rounded-md text-white"
            onClick={() => setVal(!val)}
          >
            Create Employee
          </button>
        </div>
        
      </div>

      {vall ? (
        <div>
          {val ? (
            <div>
                <div className="">
          <div className="flex justify-end  my-2">
            <p className="mx-10">
              <input
                className="text-[14px] py-1 border-2 px-4 rounded-md  border-black"
                type="text"
                placeholder="Enter Employee"
                onChange={(e) => setSearchEmp(e.target.value)}
              />
              <button
                className="bg-[#16d6f8] px-6 py-1 text-white text-sm text-bold border-[#16d6f8] rounded-md mx-10"
                onClick={() => {
                  searchEmployee();
                  setVall(false)
                }}
              >
                Search
              </button>
            </p>
          </div>
        </div>
              <table className="w-[98%] mx-4">
                {emp.map((item) => (
                  <tr className=" py-2">
                    <td>
                      <div key={item._id}>
                        <img
                          className="h-12"
                          src={`http://localhost:5500/${item.image}`}
                          alt={item.name}
                        />
                      </div>
                    </td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.mobile}</td>
                    <td>{item.designation}</td>
                    <td>{item.courses}</td>
                    <td>
                      <button className="bg-[green] px-4 py-1 text-sm mx-2 text-white" onClick={()=>handleEdit(item._id)}>
                        Edit
                      </button>
                      <button
                        className="bg-[red] text-white px-2 py-1 text-sm"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </table>
            </div>
          ) : (
            <div className="w-[50%] mx-auto">
              <form onSubmit={isEditMode ? handleUpdate : handleSubmit}>
                {isEditMode?<h1 className="text-xl font-semibold mb-6">Update Employee</h1>:<h1 className="text-xl font-semibold mb-6">Create Employee</h1>}
                <div className="my-2">
                  <label className="font-semibold my-2" htmlFor="name">
                    Name
                  </label>
                  <input
                    className="border-2 py-2 px-3 rounded-md text-sm w-full"
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter Employee Name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="my-2">
                  <label className="font-semibold my-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="border-2 py-2 px-3 rounded-md text-sm w-full"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter Employee Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="my-2">
                  <label className="font-semibold my-2" htmlFor="mobile">
                    Mobile No
                  </label>
                  <input
                    className="border-2 py-2 px-3 rounded-md text-sm w-full"
                    type="text"
                    id="mobile"
                    name="mobile"
                    placeholder="Enter Employee Mobile No"
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                </div>
                <div className="my-2">
                  <label className="font-semibold my-2" htmlFor="designation">
                    Designation
                  </label>
                  <input
                    className="border-2 py-2 px-3 rounded-md text-sm w-full"
                    type="text"
                    id="designation"
                    name="designation"
                    placeholder="Enter Employee Designation"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </div>
                <div className="my-2">
                  <label className="font-semibold my-2">Gender</label>
                  <div className="flex items-center gap-4 mt-2">
                    {["male", "female", "other"].map((gender) => (
                      <label key={gender} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="gender"
                          value={gender}
                          checked={formData.gender === gender}
                          onChange={handleChange}
                        />
                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="my-2">
                  <label className="font-semibold my-2">Course</label>
                  <div className="flex">
                    {["MCA", "BCA", "BCS"].map((course) => (
                      <label
                        key={course}
                        className="flex items-center gap-2 pr-5"
                      >
                        <input
                          type="checkbox"
                          name="courses"
                          value={course}
                          checked={formData.courses.includes(course)}
                          onChange={handleChange}
                        />
                        {course}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="font-semibold my-2" htmlFor="image">
                    Image Upload
                  </label>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    onChange={handleChange}
                  />
                </div>
                <div className="my-6">
                  {isEditMode?<button
                    type="submit"
                    className="bg-[#de2472] text-white w-full py-2 rounded-lg"
                  >
                    UPDATE
                  </button>:<button
                    type="submit"
                    className="bg-[#de2472] text-white w-full py-2 rounded-lg"
                  >
                    SUBMIT
                  </button>}
                </div>
              </form>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4">
          <table className="w-[98%] mx-4">
            {filteredEmp.map((item) => (
              <tr>
                <td>
                  <div key={item._id}>
                    <img
                      className="h-12"
                      src={`http://localhost:5500/${item.image}`}
                      alt={item.name}
                    />
                  </div>
                </td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.mobile}</td>
                <td>{item.designation}</td>
                <td>{item.courses}</td>
                <td>
                  <button className="bg-[green] px-4 py-1 text-sm mx-2 text-white">
                    Edit
                  </button>
                  <button
                    className="bg-[red] text-white px-2 py-1 text-sm"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </table>
        </div>
      )}
    </>
  );
};
