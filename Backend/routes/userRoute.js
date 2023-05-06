let express = require('express')
let router = express.Router();
let Sequelize = require('sequelize')
let jwt = require('jsonwebtoken')
let Op = Sequelize.Op
let Customer = require('../controllers/customerClass');
let Admin = require('../controllers/adminClass');
let Partner = require('../controllers/partnerClass');
let customer = new Customer()
let admin = new Admin()
let partner = new Partner()

router.get('/', (req, res, next) => {
    res.send("Test")
})

router.post('/signin', (req, res, next) => {
    let body = req.body
    if (body.role == 'customer') {
        customer.getOne({
            where: {
                [Op.and]: [
                    { email: body.email },
                    { password: body.password }
                ]
            }
        }).then(data => {
            if (data) {
                data.role = body.role
                const token = jwt.sign({ id: data.id, email: data.email }, process.env.ACCESS_TOKEN_SECRET)
                res.json({
                    token : token,
                    data : data
                })
            } else {
                res.sendStatus(401)
            }
        }).catch(error => next(error))
    } else if (body.role == 'partner') {
        partner.getOne({
            where: {
                [Op.and]: [
                    { email: body.email },
                    { password: body.password }
                ]
            }
        }).then(data => {
            if (data) {
                data.role = body.role
                const token = jwt.sign({ id: data.id, email: data.email }, process.env.ACCESS_TOKEN_SECRET)
                res.json({
                    token : token,
                    data : data
                })
            } else {
                res.sendStatus(401)
            }
        }).catch(error => next(error))
    } else {
        admin.getOne({
            where: {
                [Op.and]: [
                    { email: body.email },
                    { password: body.password }
                ]
            }
        }).then(data => {
            if (data) {
                data.role = body.role
                const token = jwt.sign({ id: data.id, email: data.email }, process.env.ACCESS_TOKEN_SECRET)
                res.json({
                    token : token,
                    data : data
                })
            } else {
                res.sendStatus(401)
            }
        }).catch(error => next(error))
    }
})

router.post('/signup', (req, res, next) => {
    let body = req.body
    customer.getOne({where: { email: body.email }})
    .then(data => {
        if (data){
            res.sendStatus(406)
        }else{
            body.isDeleted = false
            body.createdAt = Sequelize.literal('NOW()')
            body.updatedAt = Sequelize.literal('NOW()')
            customer.insertData(body)
            .then(result =>{
                if(result){res.json({success : true})}
            })
            .catch(error => next(error))
        }
    })
})

module.exports = router