let models = require('../models')
let detail = models.Detail

class Detail{
    insertData(data){
        return new Promise((resolve,reject)=>{
            detail.create(data)
            .then(resolve(true))
            .catch(error => reject(new Error(error)))
        })
    }
}

module.exports = Detail