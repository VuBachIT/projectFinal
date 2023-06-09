let models = require('../models')
let participation = models.Participation

class Participation {
    getAll(condition) {
        return new Promise((resolve, reject) => {
            participation.findAll(condition)
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

    getOne(condition) {
        return new Promise((resolve, reject) => {
            participation.findOne(condition)
                .then(response => {
                    resolve(response != null ? response.dataValues : null)
                })
                .catch(error => reject(new Error(error)))
        })
    }

    insertData(data) {
        return new Promise((resolve, reject) => {
            participation.create(data)
                .then(resolve(true))
                .catch(error => reject(new Error(error)))
        })
    }
}

module.exports = Participation