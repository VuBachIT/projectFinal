let express = require('express')
let router = express.Router()
let Sequelize = require('sequelize')
let Voucher = require('../controllers/voucherClass')
let Promotion = require('../controllers/promotionClass')
let Detail = require('../controllers/detailClass')
let voucher = new Voucher()
let promotion = new Promotion()
let detail = new Detail()

router.get('/', (req, res, next) => {
    res.send("Partner Route")
})

router.get('/voucher', (req, res, next)=>{
    voucher.getAll()
    .then(data =>{
        res.json({
            success : true,
            message : null,
            data : data
        })
    })
    .catch(error => next(error))
})

router.post('/promotion',(req, res, next)=>{
    let body = req.body
    body.isDeleted = false
    body.statusID = null
    body.createdAt = Sequelize.literal('NOW()')
    body.updatedAt = Sequelize.literal('NOW()')
    promotion.insertData(body)
    .then(id => {
        body.vouchers.forEach(element => {
            detail.insertData({
                quantity : element.quantity,
                balanceQty : element.quantity,
                voucherID : element.id,
                promotionID : id,
                createdAt : Sequelize.literal('NOW()'),
                updatedAt : Sequelize.literal('NOW()')
            })
            .then(console.log(`Cập nhật id ${element.id}`))
            .catch(error => next(error))
        });
        res.json({
            success : true,
            message : null
        })
    })
    .catch(error => next(error))

})

module.exports = router