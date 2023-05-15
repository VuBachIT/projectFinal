let models = require('../models')
let game = models.Game

class Game{
    getAll(){
        return new Promise((resolve,reject)=>{
            game.findAll()
            .then(response => {
                let data = []
                response.forEach(element => {
                    data.push(element.dataValues)
                });
                resolve(data.sort((a,b) => {return a.id - b.id}))
            })
            .catch(error =>{reject(new Error(error))})
        }) 
    }
}

module.exports = Game