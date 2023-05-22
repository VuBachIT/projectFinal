let express = require('express')
let router = express.Router()
let Sequelize = require('sequelize')
let Op = Sequelize.Op
let models = require('../models')
let Promotion = require('../controllers/promotionClass')
let Partner = require('../controllers/partnerClass')
let Customer = require('../controllers/customerClass')
let Admin = require('../controllers/adminClass')
let promotion = new Promotion()
let partner = new Partner()
let customer = new Customer()
let admin = new Admin()

router.get('/', (req, res, next) => {
    res.send('Admin Route')
})

//sử dụng localhost:3000/admin/account?type=... trong đó type là loại user (customer,admin,partner ==> viết thường không hoa)
router.get('/account', (req, res, next) => {
    if (req.query.type) {
        let query = req.query.type
        if (query == "customer") {
            customer.getAll()
                .then(data => {
                    res.json({
                        success: true,
                        message: null,
                        data: data
                    })
                })
                .catch(error => next(error))
        } else if (query == "partner") {
            partner.getAll()
                .then(data => {
                    res.json({
                        success: true,
                        message: null,
                        data: data
                    })
                })
                .catch(error => next(error))
        } else if (query == "admin") {
            admin.getAll()
                .then(data => {
                    res.json({
                        success: true,
                        message: null,
                        data: data
                    })
                })
                .catch(error => next(error))
        } else {
            res.status(406).json({
                success: false,
                message: 'Incorrect type'
            })
        }
    } else {
        res.status(406).json({
            success: false,
            message: 'Incorrect method'
        })
    }
})

router.get('/promotion', (req, res, next) => {
    promotion.getAll({
        attributes: ['id', 'title', 'description', 'start', 'end'],
        include: [
            {
                attributes: ['quantity', 'balanceQty'],
                model: models.Detail,
                include: [{
                    attributes: ['id', 'title', 'description', 'value'],
                    model: models.Voucher
                }]
            },
            {
                attributes: ['state'],
                model: models.Status,
            },
            {
                attributes: ['title'],
                model: models.Game,
            }
        ],
        where: { isDeleted: false }
    })
        .then(promotions => {
            let arr = []
            promotions.forEach(parent => {
                parent.Details.forEach(child => {
                    let voucher = child.dataValues.Voucher
                    child.dataValues.Voucher = voucher.dataValues
                    arr.push(child.dataValues)
                })
                parent.Details = arr
            })
            return promotions
        })
        .then(promotions => {
            promotions.forEach(parent => {
                let status = parent.Status.dataValues.state
                let game = parent.Game.dataValues.title
                parent.Status = status
                parent.Game = game
            })
            return promotions
        })
        .then(promotions => {
            res.json({
                success: true,
                message: null,
                data: promotions
            })
        })
        .catch(error => next(error))
})

//Dùng để ghi data của partner với đầu vào :
//==>{
// email : "Test", //string
// password : 'Test', //string
// address : 'Test', //string
// name : 'Test' //string
// }
router.post('/create', (req, res, next) => {
    let body = req.body
    partner.getOne({ where: { email: body.email } })
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
        .catch(error => next(error))
})

router.delete('/delete', (req, res, next) => {
    let body = req.body
    if (body.id && body.type) {
        if (body.type == 'promotion') {
            promotion.deleteData({ isDeleted: true }, { where: { id: body.id } })
                .then(result => {
                    if (result) {
                        res.json({
                            success: true,
                            message: null,
                        })
                    } else {
                        res.status(404).json({
                            success: false,
                            message: `Delete unsuccessful in promotionID ${body.id}`
                        })
                    }
                })
        } else if (body.type == 'customer') {
            customer.deleteData({ isDeleted: true }, { where: { id: body.id } })
                .then(result => {
                    if (result) {
                        res.json({
                            success: true,
                            message: null,
                        })
                    } else {
                        res.status(404).json({
                            success: false,
                            message: `Delete unsuccessful in customerID ${body.id}`
                        })
                    }
                })

        } else if (body.type == 'partner') {
            partner.deleteData({ isDeleted: true }, { where: { id: body.id } })
                .then(result => {
                    if (result) {
                        res.json({
                            success: true,
                            message: null,
                        })
                    } else {
                        res.status(404).json({
                            success: false,
                            message: `Delete unsuccessful in partnerID ${body.id}`
                        })
                    }
                })

        } else if (body.type == 'admin') {
            admin.deleteData({ isDeleted: true }, { where: { id: body.id } })
                .then(result => {
                    if (result) {
                        res.json({
                            success: true,
                            message: null,
                        })
                    } else {
                        res.status(404).json({
                            success: false,
                            message: `Delete unsuccessful in adminID ${body.id}`
                        })
                    }
                })
        } else {
            res.status(406).json({
                success: false,
                message: 'Incorrect type'
            })
        }
    } else {
        res.status(406).json({
            success: false,
            message: 'Incorrect method'
        })
    }
})

module.exports = router