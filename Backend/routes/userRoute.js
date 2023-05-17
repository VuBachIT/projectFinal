let express = require('express')
let router = express.Router();
let Sequelize = require('sequelize')
let jwt = require('jsonwebtoken')
let Op = Sequelize.Op
let Customer = require('../controllers/customerClass')
let Admin = require('../controllers/adminClass')
let Partner = require('../controllers/partnerClass')
let customer = new Customer()
let admin = new Admin()
let partner = new Partner()

router.get('/', (req, res, next) => {
    res.send("User Route")
})

router.post('/signin', (req, res, next) => {
    let body = req.body
    if (body.role == 'customer') {
        customer.getOne({
            where: {
                [Op.and]: [
                    { email: body.email },
                    { password: body.password },
                    { isDeleted: false }
                ]
            }
        }).then(data => {
            if (data) {
                data.role = body.role
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
                    message: "Incorrect email or password"
                })
            }
        }).catch(error => next(error))
    } else if (body.role == 'partner') {
        partner.getOne({
            where: {
                [Op.and]: [
                    { email: body.email },
                    { password: body.password },
                    { isDeleted: false }
                ]
            }
        }).then(data => {
            if (data) {
                data.role = body.role
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
                    message: "Incorrect email or password"
                })
            }
        }).catch(error => next(error))
    } else {
        admin.getOne({
            where: {
                [Op.and]: [
                    { email: body.email },
                    { password: body.password },
                    { isDeleted: false }
                ]
            }
        }).then(data => {
            if (data) {
                data.role = body.role
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
                    message: "Incorrect email or password"
                })
            }
        }).catch(error => next(error))
    }
})

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
            }
        })
})

module.exports = router