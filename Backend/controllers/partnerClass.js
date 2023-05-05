let models = require('../models')
let partner = models.Partner

class Partner{
    getOne(condition){
        return new Promise((resolve,reject)=>{
            partner.findOne(condition)
            .then(response => {
                resolve(response != null ? response.dataValues : null)
            })
            .catch(error =>{reject(new Error(error))})
        }) 
    }
}

module.exports = Partner