let express = require('express')
let router = express.Router()
let Sequelize = require('sequelize')
let Op = Sequelize.Op
let models = require('../models')
let Promotion = require('../controllers/promotionClass')
let promotion = new Promotion()

router.get('/', (req, res, next) => {
    res.send('Admin Route')
})

router.delete('/promotion', (req, res, next) => {
    if (req.query.id) {
        let query = req.query.id
        promotion.deleteData(query)
            .then(data => {
                if (data) {
                    res.json({
                        success: true,
                        message: null,
                    })
                }
            })
    }else{
        res.sendStatus(405)
    }
})

module.exports = router