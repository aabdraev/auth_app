require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const corsOptions = require('./config/corsOption')
const { logger } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')

const PORT = process.env.PORT || 3500

//connect to MongoDB
connectDB()

//custom middleware logger
app.use(logger)
//cross origin resoursce sharing

app.use(credentials)
app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: false }))
//middleware to json and static files
app.use(express.json())

//cookies
app.use(cookieParser())


//routes
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))

app.use(verifyJWT)
app.use('/users', require('./routes/api/users'));

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to mogoDB')
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
})
