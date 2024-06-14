const express = require('express')
const router = new express.Router()
const User = require('../Models/User')
const verifyAuthencation = require ('../Middlewares/verifyUserAuthentication')

//fetch(`http://localhost:3000?${}`)

//Create a User (CREATE: POST)
router.post('/signup', async (req, res) => {
    const user = new User(req.body)
    try {
        const saveUser = await user.generateAuthToken()
        res.status(201).send({user, saveUser})
        
    } catch (e) {
        res.status(400).send(e)
    }
})

//Authenticate a User
router.post('/login', async(req, res) => {
    try {
        const user = await User.findUser(req.body.email, req.body.password)
        if(!user) throw new Error('User invalid !')
        const authToken = user.generateAuthToken()
        res.send({user, authToken})
    } catch (e) {
        res.status(400).send(e)
    }
})

//Read a User to see Profile  (READ: GET)
router.get('/profile/:id', verifyAuthencation, async (req, res) =>{
    try {
        //await user.populate('tasks').exec_populate() //Pour charger les tâches de l'utilisateur
        res.send(req.user)
    } catch (error) {
        res.status(500).send(e)
    }
    
})

//Update a User (Update: PATCH)
router.patch('/profile/edit', verifyAuthencation, async (req, res)=> {
    try {
        const allowedUpdates = ['name', 'email', 'password']
        const updates = Object.keys(req.body)
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));
        if(!isValidOperation) throw new Error('Invalid Update (check the fields)!')
        
        updates.forEach(update => {req.user[update] = req.body[update]})
        await req.user.save()
        return res.send(req.user)
        
    } catch (e) {
        res.status(500).send(e)
    }
})

//Delete an User  (Delete: DELETE)
router.delete('/profile/delete', verifyAuthencation, async (req, res)=> {
    try {
        req.user.remove()
        res.send(req.user)
    } catch (e) {res.status(500).send(e)}
})

//Logout an User (POST)
router.post('/profile/logout', verifyAuthencation, async (req, res) => {
    try {
        req.user.authTokens = req.user.authTokens.filter((Tokens)=>{
            Tokens.authToken != req.authToken
        })
        const user = await req.user.save()
        res.send(user)
    } catch (e) {res.status(500).send(e)}
})

//Logout User on all Devices (POST)
router.post('/profile/logoutAll', verifyAuthencation, async (req, res) => {
    try {
            req.user.authTokens = [];
            const user = await req.user.save()
             res.send(user)
        }
        catch (e) {res.status(500).send(e)}
})

module.exports = router;