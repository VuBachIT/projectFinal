let express = require('express')
let router = express.Router()
let Sequelize = require('sequelize')
let models = require('../models');

//Cách sử dụng
//==> nhập đường dẫn localhost:3000/data/...
//ví dụ localhost:3000/data/game

router.get('/game', (req, res) => {
    let data = [{
        id: 1,
        title: 'Game A',
        isDeleted : false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        id: 2,
        title: 'Game B',
        isDeleted: false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        id: 3,
        title: 'Game C',
        isDeleted: false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }]
    models.Game.bulkCreate(data).then(res.send("Game Create"))
})

router.get('/status', (req, res) => {
    let data = [{
        id: 1,
        state: 'Pending',
        description: 'Test',
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        id: 2,
        state: 'Accepted',
        description: 'Test',
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        id: 3,
        state: 'Rejected',
        description: 'Test',
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }]
    models.Status.bulkCreate(data).then(res.send("Status Create"))
})

router.get('/voucher', (req, res) => {
    let data = [{
        id: 1,
        title: 'Voucher A',
        description: 'Test',
        value: 0.5,
        isDeleted : false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        id: 2,
        title: 'Voucher B',
        description: 'Test',
        value: 0.5,
        isDeleted : false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        id: 3,
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
        id: 1,
        type: 'Category A',
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        id: 2,
        type: 'Category B',
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        id: 3,
        type: 'Category C',
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }]
    models.Category.bulkCreate(data).then(res.send("Category Create"))
})

router.get('/admin', (req, res) => {
    let data = [{
        id: 1,
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
        id: 1,
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
        id: 1,
        email: 'partner1@gmail.com',
        password: '123',
        address : 'Test',
        name : 'Test',
        isDeleted: false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    },{
        id: 2,
        email: 'partner2@gmail.com',
        password: '123',
        address : 'Test',
        name : 'Test',
        isDeleted: false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    },{
        id: 3,
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