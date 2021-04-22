const express = require('express');
var data = require('./data');
const crypto = require('crypto');
var app=express();


app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'pug')

app.route("/users/new").get(function(req,res) {
    res.render('newUser');
});
app.route("/schedules/new").get(function(req,res) {
    res.render('newSchedule',{users:data.users});
});


app.get('/',function(req,res) {
    res.render('index', { message: 'Welcome to our schedule website!!' })
});

app.route("/users").get(function(req,res) {  
    res.render('getUsers', {users:data.users})
})



app.route("/schedules").get(function(req,res) {   
    res.render('getSchedules', {schedules:data.schedules,users:data.users})
})

app.route("/users/:id").get(function(req,res) {  
    
    let myId = req.params.id;   
    let found = data.users[myId];

    if (found) {
        res.render('getUser',{user:found});
    } else {
        res.render('error',{message: `User ${myId} not found `});  
     }
       
})

app.route("/users/:id/schedules").get(function(req,res) {  

    let aux = data.schedules;
    mySchedule = []
    let myId = parseInt(req.params.id); 
    if (myId < 0 || myId > data.users.length+1){
        let msg = "User "+myId+" not found";
        res.render("error",{message:msg});
    }
    else {
        for (i=0;i<aux.length;i++){
            if (aux[i].user_id == myId)
                mySchedule.push(aux[i])
        }
        if (mySchedule.length == 0){
            let msg = "The user "+data.users[myId].firstname+" "+data.users[myId].lastname+" doesn't have a schedule yet";
            res.render("error",{message:msg});
        } else    
            res.render('getSchedule',{schedules:mySchedule,user:data.users[myId]});
    }
    
    
});

app.route("/users/new").post(function(req,res) {

    let p = req.body.password;
    let cryptoPassword = crypto.createHmac("sha256",p).update("").digest('hex');
    let newUser = {"firstname":req.body.firstname,"lastname":req.body.lastname,"email":req.body.email,"password":cryptoPassword}
   
    let size = data.users.length;
    let count = data.users.push(newUser);
    if (count === size + 1) {
        res.redirect("/users");
    } else  {
        res.render("error",{message:"An error occured while trying to add the user"});   
    }
});


app.route("/schedules").post(function(req,res)
{
    
    let newSchedule = {"user_id":req.body.user_id,"day":req.body.day,"start_at":req.body.start_at,"end_at":req.body.end_at};
    let size = data.schedules.length;
    data.schedules.push(newSchedule);
    let count = data.schedules.length;
  
    if (count === size + 1) {
        res.redirect('/schedules');
    } else  {
        res.render("error",{message:"An error occured while trying to add the schedule"});   
    }
});

var server=app.listen(3000,function() {});
