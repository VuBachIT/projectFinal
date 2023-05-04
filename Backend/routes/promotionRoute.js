let express = require('express')
let router = express.Router();
let Promotion = require('../controllers/promotion')
let promotion = new Promotion()

router.get('/',(req,res,next) => {
    promotion.loadData({})
    .then(data =>{
        res.json(data)
    })
    .catch(error => next(error))
})

module.exports = router