let express = require('express')
let router = express.Router()
let Sequelize = require('sequelize')
let bcrypt = require('bcrypt')
let Op = Sequelize.Op
let models = require('../models')
let Promotion = require('../controllers/promotionClass')
let Category = require('../controllers/categoryClass')
let Participation = require('../controllers/participationClass')
let Customer = require('../controllers/customerClass')
let Reward = require('../controllers/rewardClass')
let Detail = require('../controllers/detailClass')
let Voucher = require('../controllers/voucherClass')
let promotion = new Promotion()
let category = new Category()
let participation = new Participation()
let customer = new Customer()
let reward = new Reward()
let detail = new Detail()
let voucher = new Voucher

//////////Test Route
router.get('/', (req, res, next) => {
    res.send('Customer Route')
})
////////////////////

//////////Get One Customer
//sử dụng localhost:3000/customer/get/:id trong đó :id là customerID
router.get('/get/:id', (req, res, next) => {
    if (!isNaN(req.params.id)) {
        let param = req.params.id
        customer.getOne({
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

//////////Update Customer
//Dùng để cập nhật data của customer với đầu vào :
//==>{
// id : 1 //int
// check : "321", //string
// address : 'Test', //string
// name : 'Test' //string
// phoneNumber : '123', //string
// lat : 106.11, //float
// long : 70.11 //float
//}
router.put('/info', (req, res, next) => {
    let body = req.body
    customer.getOne({
        where: {
            [Op.and]: [
                { id: body.id },
                { isDeleted: false }
            ]
        }
    }).then(data => {
        if (data) {
            bcrypt.compare(body.check, data.password, (err, result) => {
                if (result) {
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
                                    message: `Update unsuccessful in partnerID ${body.id}`
                                })
                            }
                        })
                        .catch(error => next(error))
                } else {
                    res.status(401).json({
                        success: false,
                        message: "Incorrect password"
                    })
                }
            })
        } else {
            res.status(404).json({
                success: false,
                message: `Not found id ${body.id}`
            })
        }
    }).catch(error => next(error))
})
////////////////////

//////////Update Customer (Password Customer)
//Dùng để cập nhật mật khẩu data của customer với đầu vào :
//==>{
// id : 1 //int
// check : "321", //string => dùng để kiểm tra
// password : 'Test', //string => dùng để lưu
//}
router.put('/password', (req, res, next) => {
    let body = req.body
    customer.getOne({
        where: {
            [Op.and]: [
                { id: body.id },
                { isDeleted: false }
            ]
        }
    }).then(data => {
        if (data) {
            bcrypt.compare(body.check, data.password, (err, result) => {
                if (result) {
                    bcrypt.hash(body.password, saltRounds, (err, hash) => {
                        body.password = hash
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
                                        message: `Update unsuccessful in partnerID ${body.id}`
                                    })
                                }
                            })
                            .catch(error => next(error))
                    })
                } else {
                    res.status(401).json({
                        success: false,
                        message: "Incorrect password"
                    })
                }
            })
        } else {
            res.status(404).json({
                success: false,
                message: `Not found id ${body.id}`
            })
        }
    }).catch(error => next(error))
})
////////////////////

//////////Get All Promotion Which Have Status 'Accepted'
//sử dụng localhost:3000/customer/promotion?search=...&type=...&latest=...&location=... 
//trong đó search là từ khóa title tìm kiếm, location là từ khóa address theo store, type là loại Category, latest là sort theo thời gian (nhập true nếu sử dụng)
//search, location, type và latest trong URL là mục đích dùng tìm kiếm và lọc
router.get('/promotion', (req, res, next) => {
    let search = (req.query.search) ? { title: { [Op.iLike]: `%${req.query.search}%` } } : {}
    let type = (req.query.type) ? { state: req.query.type } : {}
    let location = (req.query.location) ? { address: { [Op.iLike]: `%${req.query.location}%` } } : {}
    let latest = (req.query.latest == 'true') ? [['start', 'DESC']] : [['id', 'ASC']]
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
                attributes: ['id', 'name'],
                model: models.Partner,
                include: [
                    {
                        attributes: ['type'],
                        model: models.Category,
                        where: type
                    },
                    {
                        attributes: ['name', 'address', 'lat', 'long'],
                        model: models.Store,
                        where: {
                            [Op.and]: [
                                { isDeleted: false },
                                location
                            ]
                        }
                    }
                ]
            }
        ],
        where: {
            [Op.and]: [
                { isDeleted: false },
                search
            ]
        },
        order: latest
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
            promotions.forEach(parent => {
                let status = parent.Status.dataValues.state
                let game = parent.Game.dataValues
                parent.Status = status
                parent.Game = game
            })
            return promotions
        })
        .then(promotions => {
            let arr = []
            promotions.forEach(parent => {
                let partner = (parent.Partner) ? parent.Partner.dataValues : null
                if (partner) {
                    let category = partner.Category.dataValues.type
                    parent.Partner = partner
                    parent.Partner.Category = category
                    parent.Partner.Stores.forEach(child => {
                        arr.push(child.dataValues)
                    })
                    parent.Partner.Stores = arr
                    arr = []
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

//////////Get One Promotion By PromotionID
//sử dụng localhost:3000/customer/promotion/:id trong :id là id của promotion
//ví dụ localhost:3000/customer/promotion/1
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

//////////Get All Promotion Near Customer's Location
//sử dụng localhost:3000/customer/nearby?lat=...&long=... trong đó lat và long là kinh độ và vĩ độ của customer 
router.get('/nearby', (req, res, next) => {
    if (req.query.lat && req.query.long) {
        let lat = req.query.lat
        let long = req.query.long
        let arr = req.query.arr
        console.log(arr)
        let formula = `(
            6371 * acos(
                cos(radians(${lat}))
                * cos(radians(lat))
                * cos(radians(long) - radians(${long}))
                + sin(radians(${lat})) * sin(radians(lat))
            )
        )`
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
                    attributes: ['id', 'name'],
                    model: models.Partner,
                    include: [
                        {
                            attributes: ['type'],
                            model: models.Category,
                        },
                        {
                            attributes: ['name', 'address', [Sequelize.literal(formula), 'distance']],
                            model: models.Store,
                            where: { isDeleted: false },
                            order: [Sequelize.col('distance'), 'ASC'],
                        }
                    ]
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
                    arr = []
                })
                return promotions
            })
            .then(promotions => {
                promotions.forEach(parent => {
                    let status = parent.Status.dataValues.state
                    let game = parent.Game.dataValues
                    parent.Status = status
                    parent.Game = game
                })
                return promotions
            })
            .then(promotions => {
                let arr = []
                promotions.forEach(parent => {
                    let partner = parent.Partner.dataValues
                    let category = partner.Category.dataValues.type
                    parent.Partner = partner
                    parent.Partner.Category = category
                    parent.Partner.Stores.forEach(child => {
                        arr.push(child.dataValues)
                    })
                    parent.Partner.Stores = arr
                    parent.Nearby = arr[0]
                    parent.Distance = arr[0].distance
                    arr = []
                })
                return promotions.sort((a, b) => { return a.Distance - b.Distance })
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

//////////Get One Voucher
//sử dụng localhost:3000/customer/voucher/:id trong đó :id là id của voucher
router.get('/voucher/:id', (req, res, next) => {
    if (!isNaN(req.params.id)) {
        let param = req.params.id
        voucher.getOne({
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

//////////Get All Reward
//sử dụng localhost:3000/customer/reward?id=... trong đó id là customerID
router.get('/reward', (req, res, next) => {
    let date = new Date()
    if (req.query.id) {
        let query = req.query.id
        reward.getAll({
            include: [
                {
                    attributes: ['id', 'title', 'description', 'value'],
                    model: models.Voucher
                }
            ],
            where: {
                [Op.and]: [
                    { expDate: { [Op.gte]: date } },
                    { isUsed: false },
                    { customerID: query }
                ]
            },
            order: [['id', 'ASC']]
        })
            .then(rewards => {
                rewards.forEach(parent => {
                    let voucher = parent.Voucher.dataValues
                    parent.Voucher = voucher
                })
                return rewards
            })
            .then(rewards => {
                res.json({
                    success: true,
                    message: null,
                    data: rewards
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
// customerID : 1 //int
// promotionID : 1, //int
// voucherID : 1 //int
//}
router.post('/reward', (req, res, next) => {
    let body = req.body
    let date = new Date()
    let expDate = new Date(date.setMonth(date.getMonth() + 1));
    body.expDate = expDate
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