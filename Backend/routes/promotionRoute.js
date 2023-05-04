let express = require('express')
let router = express.Router();
let Promotion = require('../controllers/promotion')
let promotion = new Promotion()

router.get('/',(req,res,next) => {
    promotion.loadData({where : {isDeleted : false}})
    .then(data =>{
        res.json(data)
    })
    .catch(error => next(error))
})

router.post('/',(req,res,next)=>{
    console.log(req.body)
})

module.exports = router