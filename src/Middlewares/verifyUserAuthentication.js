const memoryCache = require('../Services/memoryCache'); 

const jwt = require('jsonwebtoken')
const User = require('../Models/User')
const verifyAuthentication = async (req, res, next) => {
    try {
        const authToken = req.session.authToken
        if(!authToken) return res.status(401).send({error: 'Accès non autorisé'})

        const cachedUser = memoryCache.get(authToken);
        if(cachedUser){
            req.user = cachedUser.value;
            next();
            return;
        }

        const decoded = jwt.verify(authToken, 'foo')
        const user = await User.findOne({_id: decoded._id, 'authTokens.authToken': authToken})
        
        if(!user) throw new Error('User not Found! Please Signup or authenticate yourself !')
        memoryCache.set(authToken, user, 60); // Stockez pendant 60 minutes
        req.user = user;

        next();
    } catch (e) {res.status(403).send('Forbidden User not Found!')}
}

module.exports = verifyAuthentication