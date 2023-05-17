let jwt = require('jsonwebtoken')

let verifyToken = (req,res,next) =>{
    let header = req.header('Authorization')
    let token = header && header.split(' ')[1]

    if (!token){
        res.status(401).json({
            success : false,
            message : 'There is no token in header'
        })
    }else{
        try {
            let check = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            console.log(check)
            next()
        } catch (error) {
            res.status(403).json({
                success : false,
                message : 'Token is invalid'
            })
        }
    }
}

module.exports = verifyToken