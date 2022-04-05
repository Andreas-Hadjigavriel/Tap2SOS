// creates a jwt for the user, after logIN or SignUP for the first time.

const expressJwt = require('express-jwt')

function authJwt() {
    const secret = process.env.ACCESS_TOKEN_SECRET
    const api = process.env.API_URL
        return expressJwt({
            secret,
            algorithms: ['HS256'],
            isRevoked: isRevoked
        }).unless({         // access in these routes without jwt
            path:[
                `${api}/users/register`,
                `${api}/users/login`,
                { url: /(.*)/ }
            ]
        })
}

async function isRevoked(req, payload, done) {
    if (payload.age < 18) {
        done(null, true)
    }
    done()
}

module.exports = authJwt