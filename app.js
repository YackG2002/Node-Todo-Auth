require('dotenv').config()
const express = require('express')
const {engine} = require('express-handlebars')
const path = require('path')
const connectDb = require('./src/Services/mongoose')
const usersRoutes = require('./src/Routes/Users')
const todosRoutes = require('./src/Routes/Todos')
const app = express();
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const session = require('express-session');

app.use(session({
    secret: 'secretKey',
    resave:false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000  }
}));

app.use(bodyParser.json())
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(usersRoutes)
app.use(todosRoutes)

app.get('/', (req, res, next) => {res.render('home', {title: 'TodoGuard'})})
app.get('/home', (req, res, next) => {res.render('home', {title: 'TodoGuard'})})
app.get('/login', (req, res, next) => {res.render('login', {title: 'TodoGuard'})})
app.get('/signup', (req, res, next) => {res.render('sign', {title: 'TodoGuard'})})



app.use((req, res, next) => {
    res.status(404).render('404', {title: '404 Not Found'})
})

app.listen(port , () => {
    console.log(`App is running on port ${port}`)
})
connectDb().catch(err => console.log(err));