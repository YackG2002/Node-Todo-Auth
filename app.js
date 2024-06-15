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

app.use(bodyParser.json())
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(usersRoutes)
app.use(todosRoutes)

app.use((req, res, next) => {
    res.status(404).render('404', {title: '404 Not Found'})
})

app.listen(port , () => {
    console.log(`App is running on port ${port}`)
})
connectDb().catch(err => console.log(err));