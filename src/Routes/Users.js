const express = require('express')
const router = new express.Router()
const User = require('../Models/User')

//fetch(`http://localhost:3000?${}`)

//Create a User (CREATE: POST)
router.post('/sign', async (req, res, next) => {
    const user = new User(req.body)
    try {
        const saveUser = await user.generateAuthToken()
        res.satus(201).send({user, saveUser})
        
    } catch (e) {
        res.satus(400).send(e)
    }
})

//Authentificate a User
router.post('/login', async(req, res, next) => {
    try {
        const user = User.findUser(req.body.email, req.body.password)
    } catch (e) {
        
    }
})

//Read a User  (READ: GET)
router.get('/profile', (req, res, next) =>{
    res.send('Hello from Profle Detail page')
})

//Update a User (Update: PATCH)

//Delete an User  (Delete: DELETE)

//Logout an User

module.exports = router;