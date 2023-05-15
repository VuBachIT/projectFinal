let models = require('../models')
let promotion = models.Promotion

class Promotion{
    getAll(condition){
        return new Promise((resolve,reject)=>{
            promotion.findAll(condition)
            .then(response =>{
                let data = []
                response.forEach(element => {
                    data.push(element.dataValues)
                });
                resolve(data.sort((a,b) => {return a.id - b.id}))
            })
            .catch(error => reject(new Error(error)))
        })
    }

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