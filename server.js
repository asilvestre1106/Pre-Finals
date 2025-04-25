const express = require('express');
const app = express(); //Express APP
const morgan = require('morgan'); //Middleware 
const mongoose = require('mongoose'); //MongoDB 
const Blog = require('./models/blogs'); //Blog
// connect to MongoDB
const dbURI = 'mongodb+srv://asilvestre1106:goodsdoggn@silvestrecluster.0qyh6kf.mongodb.net/Pre-Finals?retryWrites=true&w=majority&appName=silvestrecluster';
mongoose.connect(dbURI)
    .then(()=>app.listen(3000))
    .catch((err)=>console.log(err));

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.use(express.static('public'));
//Set up view engine
app.use(express.urlencoded({extended: true})); 
app.set('view engine', 'ejs')
app.use(morgan('dev'));

//test
//Home Page
app.get('/', (req, res)=>{
    res.redirect('/blogs');
})

//About Page
app.get('/about', (req, res)=>{
    res.render('about', {title:"About"})
})

//Redirect of about page
app.get('/about-us', (req, res)=>{
    res.redirect('about', {title:"About"})
})

app.get('/blogs', (req, res)=>{
    Blog.find().sort({createdAt: -1})
    .then((result)=>{
        res.render('index', {title: 'All Blogs', blogs: result}) 
    })
    .catch((err)=>{
        console.log(err);
    })
})

//CREATE
app.post('/blogs', (req, res)=>{
    const blog = new Blog(req.body); 
    blog.save() 
        .then((result)=>{
            res.redirect('/blogs'); 
        })
        .catch((err)=>{
            console.log(err);
        })
})
app.get('/blogs/create', (req, res)=>{
    res.render('create', {title:"Create"})
})

app.get('/blogs/:id', (req, res)=>{
    const id = req.params.id; 
    Blog.findById(id) 
        .then((result)=>{
            res.render('details', {blog: result, title: 'Blog Details'}) 
        })
        .catch((err)=>{
            res.status(404).render('404', {title: 'Blog not found'}); 
        })
})
//DELETE
app.delete('/blogs/:id', (req, res)=>{
    const id = req.params.id; 
    Blog.findByIdAndDelete(id) 
        .then(result=>{
            res.json({redirect: '/blogs'}); 
        })
        .catch((err)=>{
            console.log(err);
        })
})
//UPDATE
app.get('/blogs/:id/edit', (req, res) => {
  const id = req.params.id;

  Blog.findById(id)
    .then((result) => {
      res.render('edit', { blog: result, title: 'Edit Blog' });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).render('404', { title: 'Error' });
    });
});

app.put('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndUpdate(id, {
      title: req.body.title,
      snippet: req.body.snippet,
      body: req.body.body
    })
      .then(() => {
        res.redirect(`/blogs`);
      })
      .catch(err => console.log(err));
  });

//Page not FOUND
app.use('/', (req, res)=>{
    res.status(404).render('404', {title:"404"})
})

