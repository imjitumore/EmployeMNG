const mongoose = require("mongoose")
require("../config")

const userSchema = new mongoose.Schema({
    username:{ type: String, required: true },
    password: { type: String, required: true } 
})

const adminModel = mongoose.model("admins",userSchema)

module.exports = adminModel