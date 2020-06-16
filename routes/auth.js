const  User  = require('../models/User');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/signup', async (req, res) => {
    console.log(req.body)
    // Check if this user already exisits
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(200).send('User already exists!');
    } else {
        // Insert the new user if they do not exist yet
        user = new User({
            // name: req.body.firstName, 
            firstName: req.body.firstName,
            lastName: req.body.lastName, 
            email: req.body.email,
            mobile: req.body.mobile,
            password: req.body.password,
            type: req.body.type,
            scanCount: 0
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();
        res.status(200).send(user);
    }
});


router.post('/signin', async (req, res) => {
    console.log(req.body)
    //  Now find the user by their email address
    let user = await User.findOne({ email: req.body.email });
    console.log(user)
    if (!user) {
        return res.status(200).send('Email does not exist.');
    }
 
    // Then validate the Credentials in MongoDB match
    // those provided in the request
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        console.log("wrog pass")
        return res.status(200).send('Incorrect password.');
    }
 
    const token = jwt.sign({ _id: user._id }, "THENODEPRIVATEKEYWITHJWTAUTH__3");
    res.send({token: token, user: user});
});



 
module.exports = router;