let models = require('../models')
let status = models.Status

class Status {
    getAll(condition) {
        return new Promise((resolve, reject) => {
            status.findAll(condition)
                .then(response => {
                    let data = []
                    response.forEach(element => {
                        data.push(element.dataValues)
                    });
                    resolve(data)
                })
                .catch(error => reject(new Error(error)))
        })
    }
}

module.exports = Status