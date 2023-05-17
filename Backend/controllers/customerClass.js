let models = require('../models')
let customer = models.Customer

class Customer{
    getOne(condition){
        return new Promise((resolve,reject)=>{
            customer.findOne(condition)
            .then(response => {
                resolve(response != null ? response.dataValues : null)
            })
            .catch(error =>{reject(new Error(error))})
        }) 
    }

    insertData(data){
        return new Promise((resolve,reject)=>{
            customer.create(data)
            .then(resolve(true))
            .catch(error => reject(new Error(error)))
        })
    }

    deleteData(data,condition){
        return new Promise((resolve, reject) => {
            customer.update(data, condition)
                .then(resolve(true))
                .catch(error => reject(new Error(error)))
        })
    }
}

module.exports = Customer