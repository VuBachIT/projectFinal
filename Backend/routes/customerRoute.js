let express = require('express')
let router = express.Router()
let Sequelize = require('sequelize')
let Op = Sequelize.Op
let models = require('../models')

router.get('/', (req, res, next) => {
    res.send('Customer Route')
})



module.exports = router