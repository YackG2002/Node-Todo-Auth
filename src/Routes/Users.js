const express = require('express')
const router = new express.Router()
const User = require('../Models/User')
const verifyAuthentication = require ('../Middlewares/verifyUserAuthentication')


//Create a User (CREATE: POST)
router.post('/auth/signup', async (req, res) => {
    const {name, email, password, repeatPassword} = req.body
    if(password !== repeatPassword){
        req.session.error = "The confirmation password don't match. Try again !!";
        return res.redirect('/error'); 
    }

    const user = new User({name, email, password})
    try {
        await user.generateAuthToken()
        req.session.authToken = user.authTokens[user.authTokens.length -1].authToken
        req.session.successMessage = 'User successfully created !';
        return res.redirect('/dashboard')   
    } catch (e) {
        const statusCode = e.status || 500
        req.session.errorMessage = `${e.message}`;
        req.session.code = statusCode
        return res.redirect('/error')
    }
})
router.get('/dashboard', verifyAuthentication, (req, res) => {
    const successMessage = req.session.successMessage;
    const {name, email} = req.user
    delete req.session.successMessage;
    res.render( 'dashboard', {successMessage, name, email});
});
router.get('/error', (req, res) => {
    if(req.session.error){
        const error = req.session.error
        delete req.session.error
        return res.render('sign', {error}) 
    }
    const errorMessage = req.session.errorMessage;
    delete req.session.errorMessage; 
    const errorCode = req.session.code 
    delete req.session.code
    res.render('errors', { errorMessage, errorCode});
});

//Authenticate a User
router.post('/auth/login', async(req, res) => {
    try {
        const user = await User.findUser(req.body.email, req.body.password)
        user.generateAuthToken()
        req.session.authToken = user.authTokens[user.authTokens.length -1].authToken
        req.session.successMessage = 'Successfully connected !';
        return res.redirect('/dashboard')   
    } catch (e) {
        req.session.errorMessage = `${e.message}`
        return res.redirect('/error')
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
        delete req.session.authToken
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
        memoryCache.invalidate(req.session.authToken);
        delete req.session.authToken
        res.send(user)
    } catch (e) {res.status(401).send(e)}
})

//Logout User on all Devices (POST)
router.post('/profile/logoutAll', verifyAuthentication, async (req, res) => {
    try {
            req.user.authTokens = [];
            const user = await req.user.save()
            memoryCache.invalidate(req.session.authToken);
            delete req.session.authToken
             res.send(user)
        }
        catch (e) {res.status(500).send(e)}
})

module.exports = router;
