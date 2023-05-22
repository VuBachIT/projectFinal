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

router.get('/account', (req, res, next) => {
    if (req.query.type) {
        let query = req.query.type
        if (query == "Customer") {
            customer.getAll()
                .then(data => {
                    res.json({
                        success: true,
                        message: null,
                        data: data
                    })
                })
                .catch(error => next(error))
        } else if (query == "Partner") {
            partner.getAll()
                .then(data => {
                    res.json({
                        success: true,
                        message: null,
                        data: data
                    })
                })
                .catch(error => next(error))
        } else if (query == "Admin") {
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
                    }else{
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
                    }else{
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
                    }else{
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
                    }else{
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