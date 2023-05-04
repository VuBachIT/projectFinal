let models = require('../models')
let promotion = models.Promotion

class Promotion{
    loadData(condition){
        return new Promise((resolve,reject)=>{
            promotion.findAll(condition)
            .then(objects => {
                let data = []
                objects.forEach(element => {
                    data.push(element.dataValues)
                });
                resolve(data)
            })
            .catch(error =>{reject(new Error(error))})
        })
    }
}

module.exports = Promotion