let express = require('express')
let router = express.Router();
let bcrypt = require('bcrypt')
let Sequelize = require('sequelize')
let jwt = require('jsonwebtoken')
let Op = Sequelize.Op
let Customer = require('../controllers/customerClass')
let Admin = require('../controllers/adminClass')
let Partner = require('../controllers/partnerClass')
let customer = new Customer()
let admin = new Admin()
let partner = new Partner()
let saltRounds = 10

//////////Test Route
router.get('/', (req, res, next) => {
    res.send("User Route")
})
////////////////////

//////////Get One User (Customer, Admin, Partner) By Email And Password
//Dùng để lấy data của user theo từng role với đầu vào :
//==>{
// email : "Test", //string
// password : 'Test', //string
// role : 'customer' //string (Chỉ có admin, customer, partner ==> viết thường không hoa)
// }
router.post('/signin', (req, res, next) => {
    let body = req.body
    if (body.role == 'customer') {
        customer.getOne({
            where: {
                [Op.and]: [
                    { email: body.email },
                    { isDeleted: false }
                ]
            }
        }).then(data => {
            if (data) {
                bcrypt.compare(body.password, data.password, (err, result) => {
                    if (result) {
                        data.role = body.role
                        data.password = null
                        const token = jwt.sign({ id: data.id, email: data.email }, process.env.ACCESS_TOKEN_SECRET)
                        res.json({
                            success: true,
                            message: null,
                            token: token,
                            data: data
                        })
                    } else {
                        res.status(401).json({
                            success: false,
                            message: "Incorrect password"
                        })
                    }
                })
            } else {
                res.status(401).json({
                    success: false,
                    message: "Incorrect email"
                })
            }
        }).catch(error => next(error))
    } else if (body.role == 'partner') {
        partner.getOne({
            where: {
                [Op.and]: [
                    { email: body.email },
                    { isDeleted: false }
                ]
            }
        }).then(data => {
            if (data) {
                bcrypt.compare(body.password, data.password, (err, result) => {
                    if (result) {
                        data.role = body.role
                        data.password = null
                        const token = jwt.sign({ id: data.id, email: data.email }, process.env.ACCESS_TOKEN_SECRET)
                        res.json({
                            success: true,
                            message: null,
                            token: token,
                            data: data
                        })
                    } else {
                        res.status(401).json({
                            success: false,
                            message: "Incorrect password"
                        })
                    }
                })
            } else {
                res.status(401).json({
                    success: false,
                    message: "Incorrect email"
                })
            }
        }).catch(error => next(error))
    } else if (body.role == 'admin') {
        admin.getOne({
            where: {
                [Op.and]: [
                    { email: body.email },
                    { isDeleted: false }
                ]
            }
        }).then(data => {
            if (data) {
                bcrypt.compare(body.password, data.password, (err, result) => {
                    if (result) {
                        data.role = body.role
                        data.password = null
                        const token = jwt.sign({ id: data.id, email: data.email }, process.env.ACCESS_TOKEN_SECRET)
                        res.json({
                            success: true,
                            message: null,
                            token: token,
                            data: data
                        })
                    } else {
                        res.status(401).json({
                            success: false,
                            message: "Incorrect password"
                        })
                    }
                })
            } else {
                res.status(401).json({
                    success: false,
                    message: "Incorrect email"
                })
            }
        }).catch(error => next(error))
    } else {
        res.status(406).json({
            success: false,
            message: 'Incorrect role in body'
        })
    }
})
////////////////////

//////////Insert Customer
//Dùng để ghi data của customer với đầu vào :
//==>{
// email : "Test", //string
// password : 'Test', //string
// phoneNumber : 'Test, //string
// name : 'Test', //string
// address : ''Test, //string
// lat : 106.11, //float
// long : 70.11 //float
// }
router.post('/signup', (req, res, next) => {
    let body = req.body
    customer.getOne({ where: { email: body.email } })
        .then(data => {
            if (data) {
                res.status(406).json({
                    success: false,
                    message: "Email is already in database"
                })
            } else {
                body.isDeleted = false
                body.createdAt = Sequelize.literal('NOW()')
                body.updatedAt = Sequelize.literal('NOW()')
                bcrypt.hash(body.password, saltRounds, (err, hash) => {
                    body.password = hash
                    customer.insertData(body)
                        .then(result => {
                            if (result) {
                                res.json({
                                    success: true,
                                    message: null
                                })
                            }
                        })
                        .catch(error => next(error))
                })
            }
        })
        .catch(error => next(error))
})
////////////////////

module.exports = router