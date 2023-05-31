let express = require('express')
let router = express.Router()
let Sequelize = require('sequelize')
let Op = Sequelize.Op
let models = require('../models')
let Voucher = require('../controllers/voucherClass')
let Promotion = require('../controllers/promotionClass')
let Detail = require('../controllers/detailClass')
let Game = require('../controllers/gameClass')
let Partner = require('../controllers/partnerClass')
let Store = require('../controllers/storeClass')
let Reward = require('../controllers/rewardClass')
let voucher = new Voucher()
let promotion = new Promotion()
let detail = new Detail()
let game = new Game()
let partner = new Partner()
let store = new Store()
let reward = new Reward

//////////Test Route
router.get('/', (req, res, next) => {
    res.send('Partner Route')
})
////////////////////

//////////Get One Partner
//sử dụng localhost:3000/partner/:id trong đó :id là partnerID
router.get('/:id', (req, res, next) => {
    if (!isNaN(req.params.id)) {
        let param = req.params.id
        partner.getOne({
            where: {
                [Op.and]: [
                    { id: param },
                    { isDeleted: false }
                ]
            }
        }).then(data => {
            if (data) {
                res.json({
                    success: true,
                    message: null,
                    data: data
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: `Not found id ${param}`
                })
            }
        }).catch(error => next(error))
    } else {
        res.status(406).json({
            success: false,
            message: 'Incorrect method'
        })
    }
})
////////////////////

//////////Update Partner
//Dùng để cập nhật data của partner với đầu vào :
//==>{
// id : 1 //int
// password : "321", //string
// address : 'Test', //string
// name : 'Test' //string
//}
router.put('/', (req, res, next) => {
    let body = req.body
    partner.updateData(body, { where: { id: body.id } })
        .then(result => {
            if (result) {
                res.json({
                    success: true,
                    message: null
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: `Update unsuccessful in partnerID ${body.id}`
                })
            }
        })
        .catch(error => next(error))
})
////////////////////

//////////Get All Vouchers
router.get('/voucher', (req, res, next) => {
    voucher.getAll({
        where: { isDeleted: false },
        order: [['id', 'ASC']]
    })
        .then(data => {
            res.json({
                success: true,
                message: null,
                data: data
            })
        })
        .catch(error => next(error))
})
////////////////////

//////////Get All Games
router.get('/game', (req, res, next) => {
    game.getAll({
        where: { isDeleted: false },
        order: [['id', 'ASC']]
    })
        .then(data => {
            res.json({
                success: true,
                message: null,
                data: data
            })
        })
        .catch(error => next(error))
})
////////////////////

//////////Get All Promotion By PartnerID
//sử dụng localhost:3000/partner/promotion?id=...&search=...&type=... trong đó id là partnerID, search là từ khóa tìm kiếm, type là loại Partner
//search và type trong URL là mục đích dùng tìm kiếm và lọc
router.get('/promotion', (req, res, next) => {
    if (req.query.id) {
        let query = req.query.id
        let search = (req.query.search) ? { title: { [Op.iLike]: `%${req.query.search}%` } } : {}
        let type = (req.query.type) ? { state: req.query.type } : {}
        promotion.getAll({
            attributes: ['id', 'title', 'description', 'start', 'end'],
            include: [
                {
                    attributes: ['quantity', 'balanceQty'],
                    model: models.Detail,
                    include: [{
                        attributes: ['id', 'title', 'description', 'value'],
                        model: models.Voucher,
                    }]
                },
                {
                    attributes: ['state'],
                    model: models.Status,
                    where: type
                },
                {
                    attributes: ['title'],
                    model: models.Game,
                },
                {
                    attributes: ['id', 'expDate', 'isUsed'],
                    model: models.Reward
                },
                {
                    model: models.Participation,
                }
            ],
            where: {
                [Op.and]: [
                    { partnerID: query },
                    { isDeleted: false },
                    search
                ]
            },
            order: [['id', 'ASC']]
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
                    arr = []
                })
                return promotions
            })
            .then(promotions => {
                let arr = []
                promotions.forEach(parent => {
                    parent.Rewards.forEach(child => {
                        arr.push(child.dataValues)
                    })
                    parent.Rewards = arr
                    arr = []
                })
                return promotions
            })
            .then(promotions => {
                promotions.forEach(parent => {
                    let status = parent.Status.dataValues.state
                    let game = parent.Game.dataValues.title
                    let participations = parent.Participations.length
                    parent.Status = status
                    parent.Game = game
                    parent.Participations = participations
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
////////////////////

//////////Get One Promotion By PromotionID
//sử dụng localhost:3000/partner/promotion/:id trong :id là id của promotion
//ví dụ localhost:3000/partner/promotion/1
router.get('/promotion/:id', (req, res, next) => {
    if (!isNaN(req.params.id)) {
        let param = parseInt(req.params.id)
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
                    attributes: ['id', 'title'],
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
                    data.Details = arr
                }
                return data
            })
            .then(data => {
                if (data) {
                    let status = data.Status.dataValues.state
                    let game = data.Game.dataValues
                    data.Status = status
                    data.Game = game
                }
                return data
            })
            .then(data => {
                if (data) {
                    res.json({
                        success: true,
                        message: null,
                        data: data
                    })
                } else {
                    res.status(404).json({
                        success: false,
                        message: `Not found id ${param}`
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
////////////////////

//////////Insert Promotion
//Dùng để ghi data của promotion với đầu vào :
//==>{
// title : "Test", //string
// description : 'Test', //string
// start : '2023-12-30', //string
// end : '2023-12-30', //string
// gameID : 1, //int
// partnerID : 1, //int
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
////////////////////

//////////Update Promotion
//Dùng để cập nhật data của promotion với đầu vào :
//==>{
// id : 1 //int
// title : "Test", //string
// description : 'Test', //string
// start : '2023-12-30', //string
// end : '2023-12-30', //string
// gameID : 1, //int
// partnerID : 1 //int
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
                res.status(400).json({
                    success: false,
                    message: `Update unsuccessful in promotionID ${body.id}`
                })
            }
        })
        .catch(error => next(error))
})
////////////////////

//////////Delete Promotion
//sử dụng localhost:3000/partner/promotion/:id trong :id là id của promotion
//ví dụ localhost:3000/partner/promotion/1
router.delete('/promotion/:id', (req, res, next) => {
    if (!isNaN(req.params.id)) {
        let param = parseInt(req.params.id)
        promotion.deleteData({ isDeleted: true }, { where: { id: param } })
            .then(result => {
                if (result) {
                    res.json({
                        success: true,
                        message: null,
                    })
                } else {
                    res.status(400).json({
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
////////////////////

//////////Get All Store By PartnerID
//sử dụng localhost:3000/partner/store?id=... trong đó id là partnerID
router.get('/store', (req, res, next) => {
    if (req.query.id) {
        let query = req.query.id
        store.getAll({
            where: {
                [Op.and]: [
                    { partnerID: query },
                    { isDeleted: false }
                ]
            },
            order: [['id', 'ASC']]
        })
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
            message: 'Incorrect method'
        })
    }
})
////////////////////

//////////Get One Store By StoreID
//sử dụng localhost:3000/partner/store/:id trong :id là id của store
//ví dụ localhost:3000/partner/store/1
router.get('/store/:id', (req, res, next) => {
    if (!isNaN(req.params.id)) {
        let param = parseInt(req.params.id)
        store.getOne({
            where: {
                [Op.and]: [
                    { id: param },
                    { isDeleted: false }
                ]
            }
        })
            .then(data => {
                if (data) {
                    res.json({
                        success: true,
                        message: null,
                        data: data
                    })
                } else {
                    res.status(404).json({
                        success: false,
                        message: `Not found id ${param}`
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
////////////////////

//////////Insert Store
//Dùng để ghi data của store với đầu vào :
//==>{
// name : "Test", //string
// address : 'Test', //string
// }
router.post('/store', (req, res, next) => {
    let body = req.body
    body.isDeleted = false
    body.createdAt = Sequelize.literal('NOW()')
    body.updatedAt = Sequelize.literal('NOW()')
    store.insertData(body)
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
////////////////////

//////////Update Store
//Dùng để ghi data của store với đầu vào :
//==>{
// id : 1 ,//int
// name : "Test", //string
// address : 'Test', //string
// lat : 10,0606, //float
// long : 10,0707 //float
// }
router.put('/store', (req, res, next) => {
    let body = req.body
    store.updateData(body, { where: { id: body.id } })
        .then(result => {
            if (result) {
                res.json({
                    success: true,
                    message: null
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: `Update unsuccessful in storeID ${body.id}`
                })
            }
        })
        .catch(error => next(error))
})
////////////////////

//////////Delete Store
//sử dụng localhost:3000/partner/store/:id trong :id là id của store
//ví dụ localhost:3000/partner/store/1
router.delete('/store', (req, res, next) => {
    if (!isNaN(req.params.id)) {
        let param = parseInt(req.params.id)
        store.deleteData({ isDeleted: true }, { where: { id: param } })
            .then(result => {
                if (result) {
                    res.json({
                        success: true,
                        message: null,
                    })
                } else {
                    res.status(400).json({
                        success: false,
                        message: `Delete unsuccessful in storeID ${param}`
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
////////////////////

//////////Update Reward When Customer Uses Reward In Store (isUsed)
//sử dụng localhost:3000/partner/use?id=../ trong id là rewardID
router.put('/use', (req, res, next) => {
    if (req.query.id) {
        let query = req.query.id
        reward.updateData({ isUsed: true }, { where: { id: query } })
            .then(result => {
                if (result) {
                    res.json({
                        success: true,
                        message: null
                    })
                } else {
                    res.status(400).json({
                        success: false,
                        message: `Update unsuccessful in rewardID ${query}`
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
////////////////////

module.exports = router