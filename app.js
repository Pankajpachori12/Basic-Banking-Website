const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const alert = require('alert');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'ejs');

app.use(express.static('public'));


mongoose.connect("mongodb://127.0.0.1/bankingdb",{useNewUrlParser:true});
const usersSchema = {
    name : String,
    email : String,
    balance : Number,
    accountNo : Number
}

const User = mongoose.model('User',usersSchema);

const user0 = new User({
    name: "Pankaj Pachori",
    email: "ABC14@gmail.com",
    balance: 200000,
    accountNo: 96740820
})

const user1 = new User({
    name: "Anjali Mehra",
    email: "anjali37@gmail.com",
    balance: 200000,
    accountNo: 96740821
})

const user2 = new User({
    name: "Shubham Dubey",
    email: "shubham709@gmail.com",
    balance: 200000,
    accountNo: 96740822
})

const user3 = new User({
    name: "Aman Tiwari",
    email: "aman908@gmail.com",
    balance: 200000,
    accountNo: 96740823
})

const user4 = new User({
    name: "Astha Sharma",
    email: "astha.70@gmail.com",
    balance: 200000,
    accountNo: 96740824
})

const user5 = new User({
    name: "Santanu Roy",
    email: "suntanu_roy@gmail.com",
    balance: 200000,
    accountNo: 96740825
})

const user6 = new User({
    name: "Rahul Kumar",
    email: "rahuk@gmail.com",
    balance: 200000,
    accountNo: 96740826
})

const user7 = new User({
    name: "Gaurav Kumar",
    email: "gaurav99@gmail.com",
    balance: 200000,
    accountNo: 96740827
})

const user8 = new User({
    name: "Sachin Pachori",
    email: "sachin08@gmail.com",
    balance: 200000,
    accountNo: 96740828
})

const user9 = new User({
    name: "Harsh Raghuwanshi",
    email: "harshragh@gmail.com",
    balance: 200000,
    accountNo: 96740829
})

const user10 = new User({
    name: "Abhinav Verma",
    email: "abhinav80@gmail.com",
    balance: 200000,
    accountNo: 96740830
})

const userArray = [user0,user1, user2, user3, user4, user5, user6, user7, user8, user9, user10];

//------------ END OF MONGOOSE----------------


// -------------- DATE----------------

var options  = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

var today = new Date();

let day = today.toLocaleDateString("en-US", options);

// ------------- END OF DATE-------------



const history = [];
let amount = 0;


app.get('/',(req,res) => {
    res.sendFile(`${__dirname}/index.html`);
})


app.get('/get-started', (req, res) => {

    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {
                if(err) console.log(err);
            })
        } 
        else {
            res.render('get-started', {
                balance : foundUsers[0].balance
            })
        }
    })
    
})


app.get('/members', (req, res) => {

    User.find({}, (err, foundUsers) => {
        
        if(foundUsers.length === 0) {
        
            User.insertMany(userArray, (err) => {})
            res.redirect('/members');
        
        } 

        else{
        
            res.render('members', {
                users : foundUsers,
                balance : foundUsers[0].balance 
            })
        
        }

    })

})


app.get('/transaction', (req, res) => {
    
    User.find({}, (err, foundUsers) => {
        
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {})
        } 
        
        else{
        
            res.render('transaction', {
                users : foundUsers,
                balance : foundUsers[0].balance 
            })
        
        }
    
    })
})


app.get('/add-money', (req, res) => {
    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {
                // console.log(err);
            })
        } else {
            res.render('add-money', {
                history : history,
                balance : foundUsers[0].balance 
            })
        }
    } )
})


app.get('/add', (req, res) => {
    User.find({}, (err, foundUsers) => {
        res.render('add', {
            balance: foundUsers[0].balance
        })
    })
})


app.get('/transaction-history', (req, res) => {
    
    User.find({}, (err, foundUsers) => {
        
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {})
        } 
        
        else {
        
            res.render('history', {
                history : history,
                balance : foundUsers[0].balance 
            })
        
        }
    
    })
})


app.post('/get-started', (req, res) => {

    amount = Number(req.body.amount);

    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {

            })
        } 
        else{
            
            if(amount > foundUsers[0].balance) {
                alert('failed')
                res.redirect('/transaction');
            }

            else {
                foundUsers[0].balance -= amount;

                foundUsers[0].save();

            User.findById(req.body.select, (err, found) => {
                found.balance += amount;
                found.save();
                console.log(found.balance)
                history.push({
                    sender : foundUsers[0].name,
                    receiver : found.name,
                    amount : amount,
                    date : day
                })
            })

            alert('successful')
            res.render('get-started', {
                balance : foundUsers[0].balance
            })
            }

        }
    })
})


app.post('/members', (req, res) => {
  
    User.find({}, (err, foundUsers) => {

        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {})
        }

        else{

            let newuser = new User({
                name : req.body.name,
                email : req.body.email,
                balance : Number(req.body.balance),
                accountNo : Number(req.body.account)
            })

            foundUsers[0].balance += Number(req.body.money);
            foundUsers[0].save();
            newuser.save();
            res.redirect('/members');
        
        }
    })
})


let port = process.env.PORT;
if(port == null || port == ""){
    port = 3000;
}
app.listen(port);