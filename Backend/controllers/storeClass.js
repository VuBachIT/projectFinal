let models = require('../models')
let store = models.Store

class Store {
    getAll(condition) {
        return new Promise((resolve, reject) => {
            store.findAll(condition)
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
            store.findOne(condition)
                .then(response => {
                    resolve(response != null ? response.dataValues : null)
                })
                .catch(error => reject(new Error(error)))
        })
    }

    insertData(data) {
        return new Promise((resolve, reject) => {
            store.create(data)
                .then(response => {
                    resolve(response.dataValues.id)
                })
                .catch(error => reject(new Error(error)))
        })
    }

    updateData(data, condition) {
        return new Promise((resolve, reject) => {
            store.update(data, condition)
                .then(response => {
                    resolve(response[0] > 0 ? true : false)
                })
                .catch(error => reject(new Error(error)))
        })
    }

    deleteData(data, condition) {
        return new Promise((resolve, reject) => {
            store.update(data, condition)
                .then(response => {
                    resolve(response[0] > 0 ? true : false)
                })
                .catch(error => reject(new Error(error)))
        })
    }
}

module.exports = Store