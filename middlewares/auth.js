// check if the user token provided is the correct one, 
// or if the user does not have one. 
// We use the package jsonwebtoken, for this reason. 

const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token =   req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"]
                    
    console.log(token)
    if (!token) {
        return res.status(403).send("A token is required for authentication")
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, 
            (err, authData) => {  
            if (err) {
                res.json({
                    message: "Auth err"
                })
            } else {
                res.json({
                    message: "Auth Success",
                    authData
                })
            }
            
        })
        req.user = decoded
    } catch (err) {
        return res.status(401).send("Invalid Token")
    }
    return next()
}

module.exports = verifyToken