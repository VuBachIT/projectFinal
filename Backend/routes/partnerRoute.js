let express = require('express')
let router = express.Router()
let Sequelize = require('sequelize')
let Op = Sequelize.Op
let models = require('../models')
let Voucher = require('../controllers/voucherClass')
let Promotion = require('../controllers/promotionClass')
let Detail = require('../controllers/detailClass')
let voucher = new Voucher()
let promotion = new Promotion()
let detail = new Detail()

router.get('/', (req, res, next) => {
    res.send('Partner Route')
})

router.get('/voucher', (req, res, next) => {
    voucher.getAll()
        .then(data => {
            res.json({
                success: true,
                message: null,
                data: data
            })
        })
        .catch(error => next(error))
})

router.get('/game', (req, res, next) => {
    Game.getAll()
        .then(data => {
            res.json({
                success: true,
                message: null,
                data: data
            })
        })
        .catch(error => next(error))
})

router.get('/promotion', (req, res, next) => {
    if (req.query.id) {
        let query = req.query.id
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
            where: {
                [Op.and]: [
                    { partnerID: query },
                    { isDeleted: false }
                ]
            }
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
                    let status = parent.Status.dataValues
                    let game = parent.Game.dataValues
                    parent.Status = status
                    parent.Game = game
                })
                return promotions
            })
            .then(promotions => {
                res.json({
                    success : true,
                    message : null,
                    data : promotions
                })
            })
            .catch(error => next(error))
    }
})

router.post('/promotion', (req, res, next) => {
    let body = req.body
    body.isDeleted = false
    body.statusID = 1
    body.createdAt = Sequelize.literal('NOW()')
    body.updatedAt = Sequelize.literal('NOW()')
    promotion.insertData(body)
        .then(id => {
            body.vouchers.forEach(element => {
                detail.insertData({
                    quantity: element.quantity,
                    balanceQty: element.quantity,
                    voucherID: element.id,
                    promotionID: id,
                    createdAt: Sequelize.literal('NOW()'),
                    updatedAt: Sequelize.literal('NOW()')
                })
                    .then(console.log(`Cập nhật id ${element.id}`))
                    .catch(error => next(error))
            });
            res.json({
                success: true,
                message: null
            })
        })
        .catch(error => next(error))

})

module.exports = router