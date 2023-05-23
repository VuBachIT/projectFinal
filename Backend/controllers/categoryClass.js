let models = require('../models')
let category = models.Category

class Category{
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
}

module.exports = Category
