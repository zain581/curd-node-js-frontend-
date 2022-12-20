const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();

const dbURI = "paste here your mongodb uri that can be get form connect button";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }) //this return promise
  .then((result) =>{ console.log("Database-connected"); app.listen(8080)})
  .catch(err => console.log(err)); 



app.set('view engine', 'ejs');
 

app.use(express.static('public')); 
app.use(express.urlencoded({ extended: true })); 
app.get('/', (req, res) => {
  res.redirect('/users'); 
});

app.get('/users',(req,res)=>{
  console.log("req made on"+req.url);
   User.find().sort({createdAt:-1})
    .then(result => { 
      res.render('index', { users: result ,title: 'Home' }); //it will then render index page along with users
    })
    .catch(err => {
      console.log(err);
    });
})


app.get('/about',(req,res)=>{
  console.log("req made on"+req.url);
  res.render('about',{title:'About'});
})


app.get('/user/create',(req,res)=>{
  console.log("GET req made on"+req.url);
  res.render('adduser',{title:'Add-User'});
})

app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then(result => {
      res.render('details', { user: result, action:'edit',title: 'User Details' });
    })
    .catch(err => {
      console.log(err);
    });
});
app.get('/edit/:name/:action',(req,res)=>{
  const name = req.params.name;
  console.log("req made on"+req.url);
  User.findOne({name:name})
    .then(result => {
      res.render('edit', { user: result ,title: 'Edit-User' });
    })
    .catch(err => {
      console.log(err);
    });
})

  app.post('/user/create',(req,res)=>{
  console.log("POST req made on"+req.url);
  console.log("Form submitted to server");

  const user = new User(req.body); //passing object of form data directly to collection
  user.save() //then saving this to database and this return promise
    .then(result => {
      res.redirect('/users');//is success save this will redirect to home page
    })
    .catch(err => { 
      console.log(err);
    });

})


app.post('/edit/:id',(req,res)=>{
  console.log("POST req made on"+req.url);
  User.updateOne({_id:req.params.id},req.body) //then updating that user whose id is get from url 
                                               //first passing id which user is to be updated than passing update info
    .then(result => {
      res.redirect('/users');//is success save this will redirect to home page
      console.log("Users profile Updated");
    })
    .catch(err => { //if data not saved error showed
      console.log(err);
    });

})


//routes for deleting users by getting users name from url then finding that  users then doing delete
app.post('/users/:name',(req,res)=>{ //form action of details.ejs pass name of user that later is assume as name
  const name = req.params.name;
  console.log(name);
  User.deleteOne({name:name})
  .then(result => {
    res.redirect('/users');
  })
  .catch(err => {
    console.log(err);
  });
})

//404 errors routes
//this will auto run incase no routes
//Note: must put this route at last route list
app.use((req,res)=>{
  console.log("req made on"+req.url);
  res.render('404',{title:'NotFound'});
})






