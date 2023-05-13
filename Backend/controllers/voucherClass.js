let models = require('../models')
let voucher = models.Voucher

class Voucher{
    getAll(){
        return new Promise((resolve,reject)=>{
            voucher.findAll()
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
}

module.exports = Voucher