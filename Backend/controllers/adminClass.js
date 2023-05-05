let models = require('../models')
let admin = models.Admin

class Admin{
    getOne(condition){
        return new Promise((resolve,reject)=>{
            admin.findOne(condition)
            .then(response => {
                resolve(response != null ? response.dataValues : null)
            })
            .catch(error =>{reject(new Error(error))})
        }) 
    }
}

module.exports = Admin