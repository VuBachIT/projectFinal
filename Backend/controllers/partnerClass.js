let models = require('../models')
let partner = models.Partner

class Partner{
    getAll(condition){
        return new Promise((resolve,reject)=>{
            partner.findAll(condition)
            .then(response => {
                let data = []
                response.forEach(element => {
                    data.push(element.dataValues)
                });
                resolve(data.sort((a,b) => {return a.id - b.id}))
            })
            .catch(error =>{reject(new Error(error))})
        }) 
    }

    getOne(condition){
        return new Promise((resolve,reject)=>{
            partner.findOne(condition)
            .then(response => {
                resolve(response != null ? response.dataValues : null)
            })
            .catch(error =>{reject(new Error(error))})
        }) 
    }

    deleteData(data,condition){
        return new Promise((resolve, reject) => {
            partner.update(data, condition)
                .then(resolve(true))
                .catch(error => reject(new Error(error)))
        })
    }
}

module.exports = Partner