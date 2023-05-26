require('dotenv').config()

let fetch = require('node-fetch')
let express = require('express');
let bodyParser = require('body-parser')
let Sequelize = require('sequelize')
let verifyToken = require('./controllers/authMiddleware')
let app = express();

app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization')
    next()
})

app.get('/', (req, res) => {
    res.send('Test Server')
})

app.get('/sync', (req, res) => {
    //Chỉ dùng khi khởi tạo database
    let models = require('./models');
    models.sequelize.sync().then(() => {
        res.send('Database Sync Completed')
    })
})

// app.get('/test', (req, res) => {
//     fetch(`https://api.geoapify.com/v1/geocode/search?housenumber=125&street=Bui%20Dinh%20Tuy&city=Ho%20Chi%20Minh%20City&country=Vietnam&format=json&apiKey=554ca114825944d58808302cf431a94b`)
//         .then(response => response.json())
//         .then(data => {
//             console.log(data)
//             res.send('Test')
//         })
//         .catch(error => {
//             console.log(error)
//         })
// })

app.use('/data', require('./routes/dataRoute')) //Chỉ dùng khi thêm dữ liệu
app.use('/user', require('./routes/userRoute'))
app.use('/partner', require('./routes/partnerRoute'))
app.use('/admin', require('./routes/adminRoute'))
app.use('/customer', require('./routes/customerRoute'))

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
    console.log(`Server is running at port ${app.get('port')}`)
})
