let models = require('../models')
let activity = models.Activity

class Activity {
    insertData(data) {
        return new Promise((resolve, reject) => {
            activity.create(data)
                .then(resolve(true))
                .catch(error => reject(new Error(error)))
        })
    }
}

module.exports = Activity