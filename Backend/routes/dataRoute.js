let express = require('express')
let router = express.Router()
let Sequelize = require('sequelize')
let models = require('../models');

router.get('/game',(req,res) => {
    let data = [{
        id: 1,
        title: 'Game A',
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        id: 2,
        title: 'Game B',
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        id: 3,
        title: 'Game C',
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }]
    models.Game.create(data).then(res.send("Game Create"))
})

router.get('/status',(req,res) => {
    let data = [{
        id: 1,
        state: 'Pending',
        description : 'Test',
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        id: 2,
        state: 'Accepted',
        description : 'Test',
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        id: 3,
        state: 'Rejected',
        description : 'Test',
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }]
    models.Status.create(data).then(res.send("Status Create"))
})

router.get('/voucher',(req,res) => {
    let data = [{
        id: 1,
        title: 'Voucher A',
        description : 'Test',
        value : 0.5,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        id: 2,
        title: 'Voucher B',
        description : 'Test',
        value : 0.5,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }, {
        id: 3,
        title: 'Voucher C',
        description : 'Test',
        value : 0.5,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }]
    models.Voucher.create(data).then(res.send("Voucher Create"))
})

router.get('/admin',(req,res) => {
    let data = [{
        id: 1,
        email : 'admin@gmail.com',
        password : '123',
        isDeleted : false,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
    }]
    models.Admin.create(data).then(res.send("Admin Create"))
})

router.get('/category',(req,res) => {
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
    models.Category.create(data).then(res.send("Category Create"))
})

module.exports = router