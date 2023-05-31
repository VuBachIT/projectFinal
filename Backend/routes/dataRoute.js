let express = require('express')
let router = express.Router()
let Sequelize = require('sequelize')
let models = require('../models');

//Cách sử dụng
//==> nhập đường dẫn localhost:3000/data/...
//ví dụ localhost:3000/data/game

router.get('/game', (req, res) => {
    let data = [{
        title: 'Game A',
        isDeleted : false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        title: 'Game B',
        isDeleted: false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        title: 'Game C',
        isDeleted: false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }]
    models.Game.bulkCreate(data).then(res.send("Game Create"))
})

router.get('/status', (req, res) => {
    let data = [{
        state: 'Pending',
        description: 'Test',
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        state: 'Accepted',
        description: 'Test',
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        state: 'Rejected',
        description: 'Test',
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }]
    models.Status.bulkCreate(data).then(res.send("Status Create"))
})

router.get('/voucher', (req, res) => {
    let data = [{
        title: 'Voucher A',
        description: 'Test',
        value: 0.5,
        isDeleted : false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        title: 'Voucher B',
        description: 'Test',
        value: 0.5,
        isDeleted : false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        title: 'Voucher C',
        description: 'Test',
        value: 0.5,
        isDeleted : false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }]
    models.Voucher.bulkCreate(data).then(res.send("Voucher Create"))
})

router.get('/category', (req, res) => {
    let data = [{
        type: 'Category A',
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        type: 'Category B',
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        type: 'Category C',
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }]
    models.Category.bulkCreate(data).then(res.send("Category Create"))
})

router.get('/admin', (req, res) => {
    let data = [{
        email: 'admin@gmail.com',
        password: '123',
        isDeleted: false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }]
    models.Admin.bulkCreate(data).then(res.send("Admin Create"))
})

router.get('/customer', (req, res) => {
    let data = [{
        email: 'customer@gmail.com',
        password: '123',
        phoneNumber: '123',
        address : 'Test',
        name : 'Test',
        isDeleted: false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }]
    models.Customer.bulkCreate(data).then(res.send("Customer Create"))
})

router.get('/partner', (req, res) => {
    let data = [{
        email: 'partner1@gmail.com',
        password: '123',
        address : 'Test',
        name : 'Test',
        isDeleted: false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    },{
        email: 'partner2@gmail.com',
        password: '123',
        address : 'Test',
        name : 'Test',
        isDeleted: false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    },{
        email: 'partner3@gmail.com',
        password: '123',
        address : 'Test',
        name : 'Test',
        isDeleted: false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }]
    models.Partner.bulkCreate(data).then(res.send("Partner Create"))
})

module.exports = router