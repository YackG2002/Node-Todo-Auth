const jwt = require('jsonwebtoken')
const User = require('../Models/User')
const verifyAuthencation = async (req, res, next) => {
    try {
        const authToken = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(authToken, 'foo')
        const user = await User.findOne({_id: decoded._id, 'authTokens.authToken': authToken})
        
        if(!user) throw new Error('Please authenticate yourself !')
        req.user = user;
        req.authToken = authToken;

        next();
    } catch (e) {res.status(401).send(e)}
}

module.exports = verifyAuthencation;