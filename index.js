//Basic setup for express server as well as adding 'dev'script
const express = require('express');
const app = express();
const logger = require('morgan');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require ('./models/Users')
require('dotenv').config();

//Basic code that we will always use for mongoose
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
}).then(()=>{
    console.log('MongoDB Connected')
}).catch((err)=> console.log(`Mongo Error: ${err}`))

const port = process.env.PORT || 3000;
const userRoutes = require('./routes/userRoutes');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/api/users', userRoutes);

// app.get('/getAllUsers', (req, res)=>{
//     User.find({}).then(users=>res.json(users));
// });

// app.post('/register', (req,res)=>{
//     return new Promise((resolve, reject)=>{
//         //this destructures req.body so we don't have to use it below
//         //req.body is required to get input info 
//         const {name, email, password} = req.body;
//         //validate input
//         if(name.length === 0 || email.length === 0 ||password.length == 0){
//             return res.json({message: 'All fields must be completed'})
//         }
//         //check if user exists
//         User.findOne({email: req.body.email})
//         .then(user =>{
//             if(user){
//                 return res.status(403).json({message: 'User Already Exists'});
//             }
//             const newUser = new User();
//             const salt = bcrypt.genSaltSync(10);
//             const hash = bcrypt.hashSync(req.body.password, salt);
//             newUser.name = name;
//             newUser.email = email;
//             newUser.password = hash;
            
//             newUser.save()
//             .then((user)=> {
//                 res.status(200).json({message: 'User created', user});
//             })
//             .catch(err => {
//                 reject(err);
//             })
//         });
//     });
// });

// app.post('/login',(req, res)=>{
//     return new Promise((resolve, reject)=>{
//         User.findOne({email:req.body.email})
//         .then((user)=>{
//             bcrypt.compare(req.body.password, user.password)
//             .then((user)=>{
//                 return res.send(user===true ? 'You are now logged in':
//                  'Incorrect credentials');
//             })
//             .catch(err=>{
//                 return res.status(400).json({message: 'Server error', err})})

//             //Password match before encryption
//             // const passwordMatch = user.password === req.body.password ? true :
//             // false;
//             // if(!passwordMatch){
//             //     return res.status(400).json({message: 'Incorrect email or password'});
//             // } else{
//             //     res.status(200).json({message: `You are now logged in ${user.email}`});
//             //     resolve(user);
//             // }
//         })
//         .catch(err =>reject(err));
//     });
// });

app.put('/update/:id', (req, res) =>{
    return new Promise((resolve, reject)=>{
        User.findById({_id: req.params.id})
        .then(user=>{
            const {name, email} = req.body;
            user.name = name ? name : user.name;
            user.email = email ? email : user.email;

            user.save()
            .then((user)=> {
                return res.status(200).json({message: 'User Updated', user })
            })
            .catch(err=>reject (err))
        }).catch(err=> res.status(500).json({message: "server error", err}))
    });
});

app.delete('/delete/:id' , (req, res)=> {
    return new Promise((resolve, reject)=>{
        User.findByIdAndDelete({_id: req.params.id})
        .then((user)=> {
            return res.status(200).json({message: 'User deleted', user})
        })
        .catch(err=>res.status(400).json({message:"No user to delete"}))
    })
    
})

app.listen(port, () => {
console.log(`Listening on port ${port}`);
});
//
