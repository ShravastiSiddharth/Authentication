const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');


// This is a route "creatuser" for creating a new user
router.post('/createuser',body('name','Enter a valid name').isLength({min:3}),
    body('email','Enter a valid email').isEmail(),
    body('password','Password should be of min 5 char').isLength({min:5}),
       async (req,res)=>{
    // Validation of express-validator to check and return errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try{ 
        // Checking that user entred email is already in database or not
        let user = await User.findOne({email : req.body.email})
        if(user){
            return res.status(400).json({error : "This email is already registred"})
        }

        // Adding salt and hashing password while creating new user
        const salt = await bcrypt.genSalt(10);
        const Spassword= await bcrypt.hash(req.body.password,salt)

    // Taking info from user and creating a new user    
    user= await User.create({
        name: req.body.name,
        email: req.body.email,
        password: Spassword,
    })

    // If a user is created without errors then returning a authentication token to user
    const JWT_SECRET = 'Aauthenticatedusersignedin';
    const data = {
        user:{
        id: user.id
    }}
    const authToken = jwt.sign(data, JWT_SECRET);

    // Sending authentication token as a response
    success = true;
    res.json({success, authToken})
        }
    // Handaling any internal server error    
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }

    

    
})

// This is a route "login" to authecnticate a user
router.post('/login',
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists(),
       async (req,res)=>{

    // Validation of express-validator to check and return errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        success = false;
      return res.status(400).json({success, errors: errors.array() });
    }

    const {email,password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            success = false;
            return res.status(400).json({ success,error:'Please enter valid credentials'});           
        }

        const comparePassword = await bcrypt.compare(password,user.password);
        if(!comparePassword){
            success = false;
            return res.status(400).json({ success,error:'Please enter valid credentials'});           
        }
        
        const data = {
            user:{
            id: user.id
        }}
        JWT_SECRET = 'Aauthenticatedusersignedin';
        const authToken = jwt.sign(data, JWT_SECRET);
    
        // Sending authentication token as a response
        success = true;
        res.json({success, authToken})
            }
        // Handaling any internal server error    
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error");
        }

    })


    router.post('/getuser', fetchuser,
       async (req,res)=>{

        try {
            userid = req.user.id;
            const user = await User.findById(userid).select("-password")
            res.send(user)
            
        }  catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error");
        }
       })


module.exports = router