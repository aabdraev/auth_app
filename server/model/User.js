const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    user: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lastLogin: { type: Date },
    registrationTime: { type: Date, default: Date.now() },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' },
    refreshToken: [String]
})

module.exports = mongoose.model("User", userSchema)