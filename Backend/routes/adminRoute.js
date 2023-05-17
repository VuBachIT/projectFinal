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
                    }
                })
        }else if(body.type == 'customer'){
            customer.deleteData({ isDeleted: true }, { where: { id: body.id } })
                .then(result => {
                    if (result) {
                        res.json({
                            success: true,
                            message: null,
                        })
                    }
                })

        }else if(body.type == 'partner'){
            partner.deleteData({ isDeleted: true }, { where: { id: body.id } })
                .then(result => {
                    if (result) {
                        res.json({
                            success: true,
                            message: null,
                        })
                    }
                })

        }else if(body.type == 'admin'){
            admin.deleteData({ isDeleted: true }, { where: { id: body.id } })
                .then(result => {
                    if (result) {
                        res.json({
                            success: true,
                            message: null,
                        })
                    }
                })
        }
    } else {
        res.sendStatus(405)
    }
})

module.exports = router