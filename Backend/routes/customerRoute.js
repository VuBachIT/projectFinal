let express = require('express')
let router = express.Router()
let Sequelize = require('sequelize')
let Op = Sequelize.Op
let models = require('../models')
let Promotion = require('../controllers/promotionClass')
let Category = require('../controllers/categoryClass')
let Participation = require('../controllers/participationClass')
let Customer = require('../controllers/customerClass')
let Reward = require('../controllers/rewardClass')
let Detail = require('../controllers/detailClass')
let promotion = new Promotion()
let category = new Category()
let participation = new Participation()
let customer = new Customer()
let reward = new Reward()
let detail = new Detail

//////////Test Route
router.get('/', (req, res, next) => {
    res.send('Customer Route')
})
////////////////////

//////////Update Customer
//Dùng để cập nhật data của customer với đầu vào :
//==>{
// id : 1 //int
// password : "321", //string
// address : 'Test', //string
// name : 'Test' //string
// phoneNumber : '123' //string
//}
router.put('/', (req, res, next) => {
    let body = req.body
    customer.updateData(body, { where: { id: body.id } })
        .then(result => {
            if (result) {
                res.json({
                    success: true,
                    message: null
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: `Update unsuccessful in customerID ${body.id}`
                })
            }
        })
        .catch(error => next(error))
})
////////////////////

//////////Get All Promotion Which Have Status 'Accepted'
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
                where: { state: 'Accepted' }
            },
            {
                attributes: ['id', 'title'],
                model: models.Game,
            },
            {
                attributes: ['id', 'address', 'name'],
                model: models.Partner,
                include: [{
                    attributes: ['type'],
                    model: models.Category
                }]
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
                let game = parent.Game.dataValues
                let partner = parent.Partner.dataValues
                let category = partner.Category.dataValues.type
                parent.Status = status
                parent.Game = game
                parent.Partner = partner
                parent.Partner.Category = category
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
////////////////////

//////////Get All Promotion With Condition (Search By Keyword)
//sử dụng localhost:3000/customer/search?keyword=... trong đó keyword là từ khóa cần tìm
router.get('/search', (req, res, next) => {
    let query = req.query.keyword
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
                where: { state: 'Accepted' }
            },
            {
                attributes: ['id', 'title'],
                model: models.Game,
            },
            {
                attributes: ['id', 'address', 'name'],
                model: models.Partner,
                include: [{
                    attributes: ['type'],
                    model: models.Category
                }]
            }
        ],
        where: {
            [Op.and]: [
                { isDeleted: false },
                { title: { [Op.iLike]: `%${query}%` } }
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
                let game = parent.Game.dataValues
                let partner = parent.Partner.dataValues
                let category = partner.Category.dataValues.type
                parent.Status = status
                parent.Game = game
                parent.Partner = partner
                parent.Partner.Category = category
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
////////////////////

//////////Get All Promotion With Condition (Search By Type)
//sử dụng localhost:3000/customer/type?keyword=... trong đó keyword là type của partner
router.get('/type', (req, res, next) => {
    let query = req.query.keyword
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
                where: { state: 'Accepted' }
            },
            {
                attributes: ['id', 'title'],
                model: models.Game,
            },
            {
                attributes: ['id', 'address', 'name'],
                model: models.Partner,
                include: [{
                    attributes: ['type'],
                    model: models.Category,
                    where: { type: query }
                }],
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
                let game = parent.Game.dataValues
                let partner = parent.Partner == null ? null : parent.Partner.dataValues
                parent.Status = status
                parent.Game = game
                parent.Partner = partner
                if (partner != null) {
                    let category = partner.Category.dataValues.type
                    parent.Partner.Category = category
                }
            })
            return promotions.filter(element => element.Partner != null)
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
////////////////////

//////////Get All Promotion With Condition (Search By Time)
router.get('/latest', (req, res, next) => {
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
                where: { state: 'Accepted' }
            },
            {
                attributes: ['id', 'title'],
                model: models.Game,
            },
            {
                attributes: ['id', 'address', 'name'],
                model: models.Partner,
                include: [{
                    attributes: ['type'],
                    model: models.Category
                }]
            }
        ],
        where: { isDeleted: false },
        order: [['start', 'DESC']]
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
                let game = parent.Game.dataValues
                let partner = parent.Partner.dataValues
                let category = partner.Category.dataValues.type
                parent.Status = status
                parent.Game = game
                parent.Partner = partner
                parent.Partner.Category = category
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
////////////////////

router.get('/nearby', (req, res, next) => {

})

//////////Get All Category
router.get('/category', (req, res, next) => {
    category.getAll({ order: [['id', 'ASC']] })
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

//////////Get All Reward
//sử dụng localhost:3000/customer/reward?id=... trong đó id là customerID
router.get('/reward', (req, res, next) => {
    let date = new Date()
    if (req.query.id) {
        let query = req.query.id
        reward.getAll({
            where: {
                [Op.and]: [
                    { expDate: { [Op.gte]: date } },
                    { isUsed: false },
                    { customerID: query }
                ]
            }
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

//////////Insert Reward (Win The Game)
//Dùng để ghi data của customer khi nhận được voucher với đầu vào :
//==>{
// expDate : "2023-12-12" //string
// customerID : 1 //int
// promotionID : 1, //int
// voucherID : 1 //int
//}
router.post('/reward', (req, res, next) => {
    let body = req.body
    body.isUsed = false
    body.createdAt = Sequelize.literal('NOW()')
    body.updatedAt = Sequelize.literal('NOW()')
    reward.insertData(body)
        .then(result => {
            if (result) {
                console.log('Insert successful')
            }
            return body
        })
        .then(object => {
            detail.getOne({
                where: {
                    [Op.and]: [
                        { promotionID: object.promotionID },
                        { voucherID: object.voucherID }
                    ]
                }
            })
                .then(data => {
                    if (data) {
                        detail.updateData({ balanceQty: --data.balanceQty }, { where: { id: data.id } })
                            .then(result => {
                                if (result) {
                                    console.log(`Update quantity successful`)
                                    res.json({
                                        success: true,
                                        message: null
                                    })
                                } else {
                                    res.status(400).json({
                                        success: false,
                                        message: `Update quantity unsuccessful in detailID ${data.id}`
                                    })
                                }
                            })
                            .catch(error => next(error))
                    } else {
                        res.status(404).json({
                            success: false,
                            message: 'Not found detailID'
                        })
                    }
                })
                .catch(error => next(error))
        })
        .catch(error => next(error))
})
/////////////////////

//////////Update Reward (Gift The Voucher)
//Dùng để cập nhật data của customer khi nhận tặng voucher cho customer khác :
//==>{
// email : "test@gmail.com" //string
// rewardID : 1 //int
//}
router.put('/reward', (req, res, next) => {
    let body = req.body
    customer.getOne({
        where: {
            [Op.and]: [
                { email: body.email },
                { isDeleted: false }
            ]
        }
    })
        .then(data => {
            if (!data) {
                res.status(404).json({
                    success: false,
                    message: "Not found customer"
                })
            } else {
                reward.updateData({ customerID: data.id }, { where: { id: body.rewardID } })
                    .then(result => {
                        if (result) {
                            res.json({
                                success: true,
                                message: null
                            })
                        } else {
                            res.status(400).json({
                                success: false,
                                message: `Update unsuccessful in rewardID ${body.rewardID}`
                            })
                        }
                    })
                    .catch(error => next(error))
            }
        })
        .catch(error => next(error))
})
/////////////////////

//////////Insert Participation (Join The Promotion)
//Dùng để ghi data của participation với đầu vào :
//==>{
// customerId : 1 //int
// promotionID : 1, //int
//}
router.post('/join', (req, res, next) => {
    let body = req.body
    body.createdAt = Sequelize.literal('NOW()')
    body.updatedAt = Sequelize.literal('NOW()')
    participation.insertData(body)
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
/////////////////////

module.exports = router