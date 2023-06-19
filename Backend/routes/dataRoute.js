let express = require('express')
let router = express.Router()
let Sequelize = require('sequelize')
let models = require('../models');
let bcrypt = require('bcrypt')
let saltRounds = 10

//Cách sử dụng
//==> nhập đường dẫn localhost:3000/data/...
//ví dụ localhost:3000/data/game

router.get('/game', (req, res) => {
    let data = [{
        title: 'Game Pokemon',
        path: 'gamepokemon',
        isDeleted: false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        title: 'Game 2048',
        path: 'game2048',
        isDeleted: false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }]
    models.Game.bulkCreate(data).then(res.send("Game Create"))
})

router.get('/status', (req, res) => {
    let data = [{
        state: 'Pending',
        description: 'Tình trạng xét duyệt',
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        state: 'Accepted',
        description: 'Tình trạng chấp thuận',
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        state: 'Rejected',
        description: 'Tình trạng từ chối',
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }]
    models.Status.bulkCreate(data).then(res.send("Status Create"))
})

router.get('/voucher', (req, res) => {
    let data = [{
        title: 'Giảm 50% đơn hàng',
        description: 'Tổng hóa đơn được giảm 50%',
        value: 0.5,
        isDeleted: false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        title: 'Giảm 30% cho đơn hàng từ 100.000 trở lên',
        description: 'Tổng hóa đơn được giảm 30% nếu giá trị trên 100.000',
        value: 0.3,
        isDeleted: false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        title: 'Giảm 20% kèm theo khuyến mãi',
        description: 'Tổng hóa đơn được giảm 20% kèm khuyến mãi tại cửa hàng',
        value: 0.2,
        isDeleted: false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        title: 'Giảm 70% bằng thẻ VISA',
        description: 'Tổng hóa đơn được giảm 70% khi thanh toán bằng thẻ VISA',
        value: 0.7,
        isDeleted: false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        title: 'Giảm 60% bằng ví điện tử MOMO',
        description: 'Tổng hóa đơn được giảm 60% khi sử dụng ví MOMO',
        value: 0.6,
        isDeleted: false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        title: 'Giảm 15% trên phí vận chuyển',
        description: 'Tổng hóa đơn được giảm 15% trên phí vận chuyển',
        value: 0.15,
        isDeleted: false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }]
    models.Voucher.bulkCreate(data).then(res.send("Voucher Create"))
})

router.get('/category', (req, res) => {
    let data = [{
        type: 'Đồ Ăn',
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        type: 'Thức Uống',
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        type: 'Giải Trí',
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }]
    models.Category.bulkCreate(data).then(res.send("Category Create"))
})

router.get('/admin', (req, res) => {
    let data = [{
        email: 'bachthunhat@gmail.com',
        password: '123',
        isDeleted: false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }]
    bcrypt.hash(data[0].password, saltRounds, (err, hash) => {
        data[0].password = hash
        models.Admin.bulkCreate(data).then(res.send("Admin Create"))
    })
})

// router.get('/customer', (req, res) => {
//     let data = [{
//         email: 'customer@gmail.com',
//         password: '123',
//         phoneNumber: '123',
//         address: 'Test',
//         name: 'Test',
//         isDeleted: false,
//         createdAt: Sequelize.literal('NOW()'),
//         updatedAt: Sequelize.literal('NOW()')
//     }]
//     models.Customer.bulkCreate(data).then(res.send("Customer Create"))
// })

// router.get('/partner', (req, res) => {
//     let data = [{
//         email: 'partner1@gmail.com',
//         password: '123',
//         address: 'Test',
//         name: 'Test',
//         isDeleted: false,
//         categoryID: 1,
//         createdAt: Sequelize.literal('NOW()'),
//         updatedAt: Sequelize.literal('NOW()')
//     }]
//     bcrypt.hash(data[0].password, saltRounds, (err, hash) => {
//         data[0].password = hash
//         models.Partner.bulkCreate(data).then(res.send("Partner Create"))
//     })
// })

module.exports = router