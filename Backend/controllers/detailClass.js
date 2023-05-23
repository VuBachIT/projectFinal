let models = require('../models')
let detail = models.Detail

class Detail {
    getAll(condition) {
        return new Promise((resolve, reject) => {
            detail.findAll(condition)
                .then(response => {
                    let data = []
                    response.forEach(element => {
                        data.push(element.dataValues)
                    });
                    resolve(data.sort((a, b) => { return a.id - b.id }))
                })
                .catch(error => reject(new Error(error)))
        })
    }

    getID(condition) {
        return new Promise((resolve, reject) => {
            detail.findOne(condition)
                .then(response => {
                    resolve(response != null ? response.dataValues.id : null)
                })
                .catch(error => { reject(new Error(error)) })
        })
    }

    insertData(data) {
        return new Promise((resolve, reject) => {
            detail.create(data)
                .then(resolve(true))
                .catch(error => reject(new Error(error)))
        })
    }

    updateData(data, condition) {
        return new Promise((resolve, reject) => {
            detail.update(data, condition)
                .then(response => {
                    resolve(response[0] > 0 ? true : false)
                })
                .catch(error => reject(new Error(error)))
        })
    }
}

module.exports = Detail