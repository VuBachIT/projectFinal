let express = require('express')
let router = express.Router()
let Sequelize = require('sequelize')
let Op = Sequelize.Op
let models = require('../models')
let Promotion = require('../controllers/promotionClass')
let Partner = require('../controllers/partnerClass')
let Customer = require('../controllers/customerClass')
let Admin = require('../controllers/adminClass')
let Game = require('../controllers/gameClass')
let Voucher = require('../controllers/voucherClass')
let Status = require('../controllers/statusClass')
let promotion = new Promotion()
let partner = new Partner()
let customer = new Customer()
let admin = new Admin()
let game = new Game()
let voucher = new Voucher()
let status = new Status()

//////////Test Route
router.get('/', (req, res, next) => {
    res.send('Admin Route')
})
////////////////////

//////////Get All Status
router.get('/status', (req, res, next) => {
    status.getAll({
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

//////////Get All Promotion
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
                model: models.Status
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
                        attributes: ['name', 'address', 'lat', 'long'],
                        model: models.Store
                    }
                ]
            }
        ],
        where: { isDeleted: false },
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
                arr = []
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

//////////Update Promotion (Pending -> Accepted or Rejected)
//Dùng để cập nhật trạng thái của promotion (Pending -> Accepted hoặc Rejected) :
//==>{
// id : 1 //int
// statusID : 3 //int
//}
router.put('/promotion', (req, res, next) => {
    let body = req.body
    promotion.updateData(body, { where: { id: body.id } })
        .then(result => {
            if (result) {
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
//sử dụng localhost:3000/admin/promotion?id=... trong đó id là promotionID
router.delete('/promotion', (req, res, next) => {
    if (req.query.id) {
        let query = req.query.id
        promotion.deleteData({ isDeleted: true }, { where: { id: query } })
            .then(result => {
                if (result) {
                    res.json({
                        success: true,
                        message: null,
                    })
                } else {
                    res.status(400).json({
                        success: false,
                        message: `Delete unsuccessful in promotionID ${query}`
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

//////////Get All Account (Customer, Admin, Partner)
//sử dụng localhost:3000/admin/account?type=... trong đó type là loại user (customer, admin, partner ==> viết thường không hoa)
router.get('/account', (req, res, next) => {
    if (req.query.type) {
        let query = req.query.type
        if (query == "customer") {
            customer.getAll({
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
        } else if (query == "partner") {
            partner.getAll({
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
        } else if (query == "admin") {
            admin.getAll({
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
///////////////////

//////////Get One Account (Partner,Customer)
//sử dụng localhost:3000/admin/account/:id?type=... 
//trong đó :id là partnerID hoặc customerID, type là loại tìm kiếm (partner, customer)
router.get('/account/:id', (req, res, next) => {
    if (!isNaN(req.params.id) && req.query.type) {
        let param = req.params.id
        let type = req.query.type
        if (type == 'partner') {
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
        } else if (type == 'customer') {
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
///////////////////

//////////Insert Account (Partner)
//Dùng để ghi data của partner với đầu vào :
//==>{
// email : 'Test', //string
// password : 'Test', //string
// name : 'Test' //string
// }
router.post('/account', (req, res, next) => {
    let body = req.body
    partner.getOne({ where: { email: body.email } })
        .then(data => {
            if (data) {
                res.status(400).json({
                    success: false,
                    message: "Email is already in database"
                })
            } else {
                body.isDeleted = false
                body.createdAt = Sequelize.literal('NOW()')
                body.updatedAt = Sequelize.literal('NOW()')
                partner.insertData(body)
                    .then(result => {
                        if (result) {
                            res.json({
                                success: true,
                                message: null
                            })
                        }
                    })
                    .catch(error => next(error))
            }
        })
        .catch(error => next(error))
})
///////////////////

//////////Update Account (Partner,Customer)
//Dùng để cập nhật data (partner, customer) với đầu vào :
//==>{
// id : 1 //int
//... ==> dữ liệu cần cập nhật
// type : 'partner' //string ==> viết thường không hoa
//}
router.put('/account', (req, res, next) => {
    let body = req.body
    if (body.type == 'partner') {
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
    } else if (body.type == 'customer') {
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
    } else {
        res.status(406).json({
            success: false,
            message: 'Incorrect type'
        })
    }
})
///////////////////

//////////Delete Account (Customer, Admin, Partner)
//Dùng để xóa data (customer, admin, partner) với đầu vào :
//==>{
// id : 1, //int
// type : 'promotion', //string ==> viết thường không hoa
// }
router.delete('/account', (req, res, next) => {
    let body = req.body
    if (body.id && body.type) {
        if (body.type == 'customer') {
            customer.deleteData({ isDeleted: true }, { where: { id: body.id } })
                .then(result => {
                    if (result) {
                        res.json({
                            success: true,
                            message: null,
                        })
                    } else {
                        res.status(400).json({
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
                    } else {
                        res.status(400).json({
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
                    } else {
                        res.status(400).json({
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
///////////////////

//////////Get All Feature (Game, Voucher)
//sử dụng localhost:3000/admin/feature?type=... trong đó type là loại user (game, voucher ==> viết thường không hoa)
router.get('/feature', (req, res, next) => {
    if (req.query.type) {
        let query = req.query.type
        if (query == "game") {
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
        } else if (query == "voucher") {
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
///////////////////

//////////Get One Feature (Game, Voucher)
//sử dụng localhost:3000/admin/feature/:id?type=... trong đó type là loại user (game, voucher ==> viết thường không hoa)
//và :id là gameID hoặc voucherID tùy thuộc vào type
router.get('/feature/:id', (req, res, next) => {
    if (!isNaN(req.params.id)) {
        let query = req.query.type
        let param = req.params.id
        if (query == 'game') {
            game.getOne({
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
        } else if (query == 'voucher') {
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
///////////////////

///////////Insert Feature (Game, Voucher)
//Dùng để ghi data của feature (voucher, game) với đầu vào :
//==>{
// ... ==> dữ liệu của loại game hoặc voucher
// type : "game" ==> viết thường không hoa
// }
router.post('/feature', (req, res, next) => {
    let body = req.body
    body.isDeleted = false
    body.createdAt = Sequelize.literal('NOW()')
    body.updatedAt = Sequelize.literal('NOW()')
    if (body.type == 'game') {
        game.insertData(body)
            .then(result => {
                if (result) {
                    res.json({
                        success: true,
                        message: null
                    })
                }
            })
            .catch(error => next(error))
    } else if (body.type == 'voucher') {
        voucher.insertData(body)
            .then(result => {
                if (result) {
                    res.json({
                        success: true,
                        message: null
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
///////////////////

//////////Update Feature (Game, Voucher)
//Dùng để cập nhật data (voucher, game) với đầu vào :
//==>{
// id : 1 //int
//... ==> dữ liệu cần cập nhật
// type : 'game' //string ==> viết thường không hoa
//}
router.put('/feature', (req, res, next) => {
    let body = req.body
    if (body.type == 'game') {
        game.updateData(body, { where: { id: body.id } })
            .then(result => {
                if (result) {
                    res.json({
                        success: true,
                        message: null
                    })
                } else {
                    res.status(400).json({
                        success: false,
                        message: `Update unsuccessful in gameID ${body.id}`
                    })
                }
            })
            .catch(error => next(error))
    } else if (body.type == 'voucher') {
        voucher.updateData(body, { where: { id: body.id } })
            .then(result => {
                if (result) {
                    res.json({
                        success: true,
                        message: null
                    })
                } else {
                    res.status(400).json({
                        success: false,
                        message: `Update unsuccessful in voucherID ${body.id}`
                    })
                }
            })
            .catch(error => next(error))
    } else {
        res.status(406).json({
            success: false,
            message: 'Incorrect type'
        })
    }
})
////////////////////

//////////Delete Feature (Game, Voucher)
//Dùng để xóa data (voucher, game) với đầu vào :
//==>{
// id : 1, //int
// type : 'promotion', //string ==> viết thường không hoa
// }
router.delete('/feature', (req, res, next) => {
    let body = req.body
    if (body.id && body.type) {
        if (body.type == 'game') {
            game.deleteData({ isDeleted: true }, { where: { id: body.id } })
                .then(result => {
                    if (result) {
                        res.json({
                            success: true,
                            message: null,
                        })
                    } else {
                        res.status(400).json({
                            success: false,
                            message: `Delete unsuccessful in gameID ${body.id}`
                        })
                    }
                })
        } else if (body.type == 'voucher') {
            voucher.deleteData({ isDeleted: true }, { where: { id: body.id } })
                .then(result => {
                    if (result) {
                        res.json({
                            success: true,
                            message: null,
                        })
                    } else {
                        res.status(400).json({
                            success: false,
                            message: `Delete unsuccessful in voucherID ${body.id}`
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
////////////////////

module.exports = router