let models = require('../models')
let reward = models.Reward

class Reward {
    getAll(condition) {
        return new Promise((resolve, reject) => {
            reward.findAll(condition)
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

    insertData(data) {
        return new Promise((resolve, reject) => {
            reward.create(data)
                .then(resolve(true))
                .catch(error => reject(new Error(error)))
        })
    }

    updateData(data, condition) {
        return new Promise((resolve, reject) => {
            reward.update(data, condition)
                .then(response => {
                    resolve(response[0] > 0 ? true : false)
                })
                .catch(error => reject(new Error(error)))
        })
    }
}

module.exports = Reward