let models = require('../models')
let participation = models.Participation

class Participation {
    insertData(data) {
        return new Promise((resolve, reject) => {
            participation.create(data)
                .then(resolve(true))
                .catch(error => reject(new Error(error)))
        })
    }
}

module.exports = Participation