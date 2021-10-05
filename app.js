const path=require('path')
const express = require('express')
const mongoose=require('mongoose')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport=require('passport')
const session = require('express-session')
const MongoStore=require('connect-mongo')
//load config
dotenv.config({ path: './config/config.env' })

//Passport config
require('./config/passport')(passport)


//connect db
connectDB()

const app = express()

//logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//handlebars
app.engine('.hbs', exphbs({defaultLayout:'main', extname: '.hbs' }))
app.set('view engine', '.hbs')


//Sessions
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl:process.env.MONGO_URI
    })
    // store:new MongoStore({mongooseConnection:mongoose.connection})
    // cookie: { secure: true }
    
}))
//Passport middleware
app.use(passport.initialize())
app.use(passport.session())


//Static folder
app.use(express.static(path.join(__dirname,'public')))


//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))


const PORT = process.env.PORT || 5000

app.listen(PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)