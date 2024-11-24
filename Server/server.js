const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const adminModel = require("./modules/adminModule");
const employeeModel = require("./modules/employeeModule");
const port = 5500;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const admin = await adminModel.findOne({});
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    if (username === admin.username && password === admin.password) {
      return res.status(200).json({ message: "Login successful!", admin: admin.username });
    } else {
      return res.status(401).json({ message: "Invalid username or password." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/api/employee", upload.single("image"), async (req, res) => {
  try {
    const { name, email, mobile, designation, gender, courses} = req.body;
    const image = req.file ? req.file.path : null;

    if (!name || !email || !mobile || !designation || !gender || !courses) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const existingEmployee = await employeeModel.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: "Duplicate email not allowed" });
}

    const newEmployee = new employeeModel({
      name,
      email,
      mobile,
      designation,
      gender,
      courses,
      image,
    });

    const savedEmployee = await newEmployee.save();

    return res.status(201).json({
      message: "Employee created successfully!",
      employee: savedEmployee,
    });
  } catch (error) {
    console.error("Error creating employee:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});


app.get("/api/employees", async (req, res) => {
    try {
      const result = await employeeModel.find({});
      console.log(result);
      
      res.status(200).json({ message: "Total Employees", employees: result });
    } catch (err) {
      console.error("Error fetching employees:", err);
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  app.delete("/api/removeEmployee/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log("Employee ID to delete:", id);
  
      const deletedEmployee = await employeeModel.findByIdAndDelete(id);
        console.log(deletedEmployee)
      if (!deletedEmployee) {
        return res.status(404).json({ message: "Employee not found." });
      }
  
      console.log("Deleted Employee:", deletedEmployee);
      return res.status(200).json({ message: "Employee deleted successfully!" });
    } catch (error) {
      console.error("Error deleting employee:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  });
  
  app.get("/api/searchEmployee", async (req, res) => {
    try {
      const { query } = req.query; 
      console.log(query)
      if (!query) {
        return res.status(400).json({ message: "Search query is required." });
      }
  
    
      const employees = await employeeModel.find({
        $or: [
          { name: { $regex: query, $options: "i" } }, 
          { email: { $regex: query, $options: "i" } },
        ],
      });
  
      if (employees.length === 0) {
        return res.status(404).json({ message: "No employees found." });
      }
  
      res.status(200).json({ employees });
    } catch (error) {
      console.error("Error searching employee:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  });
  


  app.put("/api/updateEmployee/:id", upload.single("image"), async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, mobile, designation, gender, courses } = req.body;
  
      const updateData = {
        name,
        email,
        mobile,
        designation,
        gender,
        courses
      };
  
      if (req.file) {
        updateData.image = req.file.path;
      }
  
      const updatedEmployee = await employeeModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );
  
      if (!updatedEmployee) {
        return res.status(404).json({ message: "Employee not found." });
      }
  
      res.status(200).json({ message: "Employee updated successfully!" });
    } catch (error) {
      console.error("Error updating employee:", error);
      res.status(500).json({ message: "Failed to update employee." });
    }})
app.listen(port, () => {
  console.log("Server Running on port " + port);
});
