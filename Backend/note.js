let data;
//PHẦN USER
//POST:localhost:3000/user/signin
data = {
    email : 'test@gmail.com', //string
    password : '123', //string 
    role : 'admin' //admin or partner or customer (viết thường)
}
//POST:localhost:3000/user/signup
data = {
    email : 'test@gmail.com', //string
    password : '123', //string
    address : 'Test', //string
    phoneNumber : 'Test', //string
    name : 'Test', //string
}

//PHẦN PARTNER
//POST:localhost:3000/partner/promotion
data = {
    title : "Test", //string
    description : 'Test', //string
    start : '2023-12-30', //string
    end : '2023-12-30', //string
    gameID : 1, //int
    vouchers : [
        {
            id : 1, //int
            quantity : 50 //int 
        }
    ] //array 
}
//GET:localhost:3000/partner/promotion?id=1 => sử dụng query (id=1)

//PHẦN ADMIN
//DELETE:localhost:3000/admin/delete
data = {
    id : 1, //int
    type : 'promotion' //admin or partner or customer or promotion (viết thường)
}
