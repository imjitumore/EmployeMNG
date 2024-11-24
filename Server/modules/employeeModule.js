const mongoose = require("mongoose");
require("../config");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  designation: { type: String, required: true },
  gender: { type: String, required: true },
  courses: { type: [String], required: true }, 
  image: { type: String, required: true },
});

const employeeModel = mongoose.model("employees", employeeSchema);

module.exports = employeeModel;
