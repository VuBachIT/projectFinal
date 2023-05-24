let express = require('express')
let router = express.Router()
let Sequelize = require('sequelize')
let Op = Sequelize.Op
let models = require('../models')
let Promotion = require('../controllers/promotionClass')
let Category = require('../controllers/categoryClass')
let Participation = require('../controllers/participationClass')
let Customer = require('../controllers/customerClass')
let Activity = require('../controllers/activityClass')
let Detail = require('../controllers/detailClass')
let promotion = new Promotion()
let category = new Category()
let participation = new Participation()
let customer = new Customer()
let activity = new Activity()
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
                res.status(404).json({
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

//////////Get All Category
router.get('/category', (req, res, next) => {
    category.getAll()
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

router.get('/prize', (req, res, next) => {

})

//////////Insert Participation
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

//////////Insert Voucher When Customer Win The Game
//Dùng để ghi data của customer khi nhận được voucher với đầu vào :
//==>{
// expDate : "2023-12-12" //string
// customerId : 1 //int
// promotionID : 1, //int
// voucherID : 1 //int
//}
router.post('/reward', (req, res, next) => {
    let body = req.body
    body.isUsed = false
    body.createdAt = Sequelize.literal('NOW()')
    body.updatedAt = Sequelize.literal('NOW()')
    activity.insertData(body)
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
                                    res.status(404).json({
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



module.exports = router