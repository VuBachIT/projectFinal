let express = require('express')
let router = express.Router();
let Sequelize = require('sequelize')
let Op = Sequelize.Op
let Customer = require('../controllers/customerClass');
let Admin = require('../controllers/adminClass');
let Partner = require('../controllers/partnerClass');
let customer = new Customer()
let admin = new Admin()
let partner = new Partner()

router.get('/',(req,res,next) => {
  res.send("Test") 
})

router.post('/signin',(req,res,next)=>{
    let body = req.body
    if(body.role == 'customer'){
        customer.getOne({
            where :{
                [Op.and]: [
                    { email: body.email },
                    { password: body.password }
                ]
            } 
        }).then(data => {
            if (data){
                data.role = body.role
            }
            res.json(data)
        }).catch(error => next(error))
    }else if(body.role == 'partner'){
        partner.getOne({
            where :{
                [Op.and]: [
                    { email: body.email },
                    { password: body.password }
                ]
            } 
        }).then(data => {
            if (data){
                data.role = body.role
            }
            res.json(data)
        }).catch(error => next(error))
    }else{
        admin.getOne({
            where :{
                [Op.and]: [
                    { email: body.email },
                    { password: body.password }
                ]
            } 
        }).then(data => {
            if (data){
                data.role = body.role
            }
            res.json(data)
        }).catch(error => next(error))
    }
})

module.exports = router