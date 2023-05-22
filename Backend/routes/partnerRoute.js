let express = require('express')
let router = express.Router()
let Sequelize = require('sequelize')
let Op = Sequelize.Op
let models = require('../models')
let Voucher = require('../controllers/voucherClass')
let Promotion = require('../controllers/promotionClass')
let Detail = require('../controllers/detailClass')
let Game = require('../controllers/gameClass')
let voucher = new Voucher()
let promotion = new Promotion()
let detail = new Detail()
let game = new Game()

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
    game.getAll()
        .then(data => {
            res.json({
                success: true,
                message: null,
                data: data
            })
        })
        .catch(error => next(error))
})

//sử dụng localhost:3000/partner/promotion?id=... trong đó id là partnerID
router.get('/promotion', (req, res, next) => {
    if (req.query.id) {
        let query = req.query.id
        console.log(query)
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
    } else {
        res.status(406).json({
            success: false,
            message: 'Incorrect method'
        })
    }
})

//sử dụng localhost:3000/partner/promotion/:id trong :id là id của promotion
//vì dụ localhost:3000/partner/promotion/1
router.get('/promotion/:id', (req, res, next) => {
    if (req.params.id) {
        let param = parseInt(req.params.id)
        console.log(param)
        promotion.getOne({
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
                    { id: param },
                    { isDeleted: false }
                ]
            }
        })
            .then(data => {
                if (data) {
                    let arr = []
                    data.Details.forEach(element => {
                        let voucher = element.dataValues.Voucher
                        element.dataValues.Voucher = voucher.dataValues
                        arr.push(element.dataValues)
                    })
                    return data
                }
                return data
            })
            .then(data => {
                if (data){
                    let status = data.Status.dataValues.state
                    let game = data.Game.dataValues.title
                    data.Status = status
                    data.Game = game
                }
                return data
            })
            .then(data => {
                if (data){
                    res.json({
                        success: true,
                        message: null,
                        data: data
                    })
                }else{
                    res.status(404).json({
                        success : false,
                        message : `Not found id ${param}`
                    })
                }
            })
            .catch(error => next(error))
    } else {
        res.status(406).json({
            success: false,
            message: 'Incorrect method'
        })
    }
})

//Dùng để ghi data của promotion với đầu vào :
//==>{
// title : "Test", //string
// description : 'Test', //string
// start : '2023-12-30', //string
// end : '2023-12-30', //string
// gameID : 1, //int
// vouchers : [
//     {
//         id : 1, //int
//         quantity : 50 //int 
//     }
// ] 
// }
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
                    quantity: parseInt(element.quantity),
                    balanceQty: parseInt(element.quantity),
                    voucherID: element.id,
                    promotionID: id,
                    createdAt: Sequelize.literal('NOW()'),
                    updatedAt: Sequelize.literal('NOW()')
                })
                    .then(console.log('Insert successful'))
                    .catch(error => next(error))
            });
            res.json({
                success: true,
                message: null
            })
        })
        .catch(error => next(error))
})

//Dùng để cập nhật data của promotion với đầu vào :
//==>{
// id : 1 //int
// title : "Test", //string
// description : 'Test', //string
// start : '2023-12-30', //string
// end : '2023-12-30', //string
// gameID : 1, //int
// vouchers : [
//     {
//         id : 1, //int
//         quantity : 50 //int 
//     }
// ] 
//}
router.put('/promotion', (req, res, next) => {
    let body = req.body
    body.statusID = 1
    promotion.updateData(body, { where: { id: body.id } })
        .then(result => {
            if (result) {
                body.vouchers.forEach(element => {
                    let data = {
                        quantity: parseInt(element.quantity),
                        balanceQty: parseInt(element.quantity)
                    }
                    let condition = {
                        [Op.and]: [
                            { voucherID: element.id },
                            { promotionID: body.id }
                        ]
                    }
                    detail.updateData(data, { where: condition })
                        .then(result => {
                            if (result) {
                                console.log('Update successful')
                            } else {
                                detail.insertData({
                                    quantity: data.quantity,
                                    balanceQty: data.quantity,
                                    voucherID: element.id,
                                    promotionID: body.id,
                                    createdAt: Sequelize.literal('NOW()'),
                                    updatedAt: Sequelize.literal('NOW()')
                                })
                                    .then(console.log('Insert successful'))
                                    .catch(error => next(error))
                            }
                        })
                        .catch(error => next(error))
                });
                res.json({
                    success: true,
                    message: null
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: `Update unsuccessful in promotionID ${body.id}`
                })
            }
        })
        .catch(error => next(error))
})

//sử dụng localhost:3000/partner/promotion/:id trong :id là id của promotion
//vì dụ localhost:3000/partner/promotion/1
router.delete('/promotion/:id', (req, res, next) => {
    if (req.params.id) {
        let param = parseInt(req.params.id)
        promotion.deleteData({ isDeleted: true }, { where: { id: param } })
            .then(result => {
                if (result) {
                    res.json({
                        success: true,
                        message: null,
                    })
                } else {
                    res.status(404).json({
                        success: false,
                        message: `Delete unsuccessful in promotionID ${param}`
                    })
                }
            })
    } else {
        res.status(406).json({
            success: false,
            message: 'Incorrect method'
        })
    }
})

module.exports = router