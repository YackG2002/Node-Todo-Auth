const express = require('express')
const router = new express.Router()
const User = require('../Models/User')
const verifyAuthentication = require ('../Middlewares/verifyUserAuthentication')


//Create a User (CREATE: POST)
router.post('/signup', async (req, res) => {
    const user = new User(req.body)
    try {
        const saveUser = await user.generateAuthToken()
        res.status(201).send({saveUser})
        
    } catch (e) {
        res.status(400).send(e)
    }
})

//Authenticate a User
router.post('/login', async(req, res) => {
    try {
        const user = await User.findUser(req.body.email, req.body.password)
        user.generateAuthToken()
        res.send({user})
    } catch (e) {
        console.error(e)
        res.status(400).send(e)
    }
})

//Read a User to see Profile  (READ: GET)
router.get('/profile', verifyAuthentication, async (req, res) =>{
    try {
        //await user.populate('tasks').exec_populate() //Pour charger les tâches de l'utilisateur
        res.send(req.user)
    } catch (error) {
        console.error(error)
        res.status(401).send(error)
    }
    
})

//Update a User (Update: PATCH)
router.patch('/profile/edit', verifyAuthentication, async (req, res)=> {
    try {
        const allowedUpdates = ['name', 'email', 'password']
        const updates = Object.keys(req.body)
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));
        if(!isValidOperation) throw new Error('Invalid Update (check the fields)!')
        
        updates.forEach(update => {req.user[update] = req.body[update]})
        await req.user.save()
        return res.send(req.user)
        
    } catch (e) {
        console.error(e)
        res.status(401).send(e)
    }
})

//Delete an User  (Delete: DELETE)
router.delete('/profile/delete', verifyAuthentication, async (req, res)=> {
    if (!req.user) return res.status(404).send('User not found');
    try {
        await User.deleteOne({ _id: req.user._id });
        res.status(200).send(req.user);
    } catch (e) { 
        console.error(e)
        res.status(500).send(e);}
})

//Logout an User (POST)
router.post('/profile/logout', verifyAuthentication, async (req, res) => {
    try {
        req.user.authTokens = req.user.authTokens.filter((Tokens)=>{
            Tokens.authToken != req.authToken
        })
        const user = await req.user.save()
        res.send(user)
    } catch (e) {res.status(401).send(e)}
})

//Logout User on all Devices (POST)
router.post('/profile/logoutAll', verifyAuthentication, async (req, res) => {
    try {
            req.user.authTokens = [];
            const user = await req.user.save()
             res.send(user)
        }
        catch (e) {res.status(500).send(e)}
})

module.exports = router;
