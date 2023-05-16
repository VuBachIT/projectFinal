require('dotenv').config()

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

app.get('/',(req,res)=>{
    res.send('Test Server')
})

app.get('/sync', (req, res) => {
    //Chỉ dùng khi khởi tạo database
    let models = require('./models');
    models.sequelize.sync().then(() => {
        res.send('Database Sync Completed')
    })
})

app.get('/data',(req,res)=>{
    //Chỉ dùng khi thêm dữ liệu
    // let data = {
    //     ...
    // }
    // data.createdAt = Sequelize.literal('NOW()')
    // data.updatedAt = Sequelize.literal('NOW()')
    // let models = require('./models');
    // models.Game.create(data).then(res.send("Test Create"))
})

app.use('/user',require('./routes/userRoute'))
app.use('/partner',require('./routes/partnerRoute'))
app.use('/admin',require('./routes/adminRoute'))

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
    console.log(`Server is running at port ${app.get('port')}`)
})
