let models = require('../models')
let promotion = models.Promotion

class Promotion{
    insertData(data){
        return new Promise((resolve,reject)=>{
            promotion.create(data)
            .then(response =>{
                resolve(response.dataValues.id)
            })
            .catch(error => reject(new Error(error)))
        })
    }
}

module.exports = Promotion