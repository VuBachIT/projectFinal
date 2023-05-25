let models = require('../models')
let game = models.Game

class Game {
    getAll(condition) {
        return new Promise((resolve, reject) => {
            game.findAll(condition)
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

    insertData(data) {
        return new Promise((resolve, reject) => {
            game.create(data)
                .then(resolve(true))
                .catch(error => reject(new Error(error)))
        })
    }

    updateData(data, condition) {
        return new Promise((resolve, reject) => {
            game.update(data, condition)
                .then(response => {
                    resolve(response[0] > 0 ? true : false)
                })
                .catch(error => reject(new Error(error)))
        })
    }

    deleteData(data, condition) {
        return new Promise((resolve, reject) => {
            game.update(data, condition)
                .then(resolve(true))
                .catch(error => reject(new Error(error)))
        })
    }
}

module.exports = Game