const { uuid } = require('uuidv4');
const { validationResult } = require('express-validator')
const { map } = require('lodash')
const HttpError = require('../models/http-error')
const User = require('../models/user_model')
const mongoose = require('mongoose')
const Post = require('../models/post_model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const getUsers = async (req, res, next) => {
    const uid = req.params.uid //This contains the user id of the user requested
    console.log(uid)
    let users
    try { users = await User.findById(uid) }
    catch (err) {
        const error = new HttpError('Fetching users failed, please try again later.', 500)
        return next(error)
    }
    console.log(users)
    res.json({ users: users.toObject({ getters: true }) })
}

const signup = async (req, res, next) => {
    let error = validationResult(req)
    if (!error.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        )
    }

    console.log(req.body)

    const { name, email, password, age, contact } = req.body; //Destructuring the request


    const existingUser = await User.findOne({ email: email })
    if (existingUser == 0) {
        console.log(existingUser)
        const error = new HttpError('User exists already, please login instead.', 422)
        return next(error)
    }

    let hashedPassword
    try {
        hashedPassword = await bcrypt.hash(password, 12)
    } catch (err) {
        const error = new HttpError('Could not create Password, please try again.', 500)
        return next(error)
    }

    const createdUser = new User({
        name,
        email,
        password: hashedPassword,
        image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80",
        age: age,
        contact: contact,
        places: [],
        places_following: [],
        followers: [],
        following: []
    });

    try {
        await createdUser.save()
    } catch (err) {
        error = new HttpError('Signing up failed, please try again later. Here', 500)
        return next(error)
    }

    let token
    try {
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email },
            'supersecret_dont_share',
            { expiresIn: '1h' }
        )
    } catch (err) {
        const error = new HttpError('Signing up failed, please try again later.', 500)
        return next(error)
    }

    res.status(201).json({
        userId: createdUser.id, 
        email: createdUser.email,
        token: token
    })
}

const login = async (req, res, next) => {
    //Destructure the request -> Email and password
    const { email, password } = req.body;

    // console.log(req.body)

    const existingUser = await User.findOne({ email: email })
    if (!existingUser) {
        const error = new HttpError('User does not exist, please signup instead.', 422)
        return next(error)
    }

    console.log(password)
    console.log(existingUser.password)

    let isValidPassword = false
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password)
    } catch (err) {
        const error = new HttpError('Could not log you in, please check your credentials and try again.', 500)
        return next(error)
    }

    if(!isValidPassword) {
        const error = new HttpError('Invalid credentials, could not log you in.', 401)
        return next(error)
    }

    let token
    try {
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            'supersecret_dont_share',
            { expiresIn: '1h' }
        )
    } catch (err) {
        const error = new HttpError('Logging in failed, please try again later.', 500)
        return next(error)
    }

    res.json({ userId: existingUser.id, email: existingUser.email , token: token })
}

const followUser = async (req, res, next) => {
    const uid = req.params.uid //This contains the user id of the user requested

    let user;
    try { user = await User.findById(uid) }
    catch (err) {
        const error = new HttpError('Fetching users failed, please try again later.', 500)
        return next(error)
    }
    console.log(user)

    let post;
    console.log(req.body.post_id)
    try {
        post = await Post.findById(req.body.post_id)
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find Post', 500)
        return next(error)
    }
    console.log(req.body.post_id)

    let posted_By_User;
    try {
        posted_By_User = await User.findById(post.postedBy)
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find User', 500)
        return next(error)
    }
    console.log(posted_By_User)
    console.log(user)

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        //Check if user is aldready following the user
        if (user.following.includes(posted_By_User)) {
            const error = new HttpError('You are already following this user', 500)
            return next(error)
        }
        user.following.push(posted_By_User);
        posted_By_User.followers.push(user);
        await posted_By_User.save({ session: sess });
        await user.save({ session: sess });
        await sess.commitTransaction();
    }
    catch (err) {
        const error = new HttpError('Something went wrong, could not follow user.', 500)
        return next(error)
    }

    res.status(201).json({ user: user.toObject({ getters: true }) })
}

const unfollowUser = async (req, res, next) => {
    let user_to_unfollow = req.body.user_to_unfollow; //This contains the user id of the user To Unfollow
    let user = req.params.uid; //This contains the user id of the user Logged in

    let user_to_unfollow_object;
    try { user_to_unfollow_object = await User.findById(user_to_unfollow)
        console.log(user_to_unfollow_object.name)
     }
    catch(err){
        const error = new HttpError('Fetching user to unfollow failed, please try again later.', 500)
        return next(error)
    }

    let user_object;
    try { user_object = await User.findById(user) 
        console.log(user_object.name)
    }
    catch(err){
        const error = new HttpError('Fetching user logged in failed, please try again later.', 500)
        return next(error)
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        user_object.following.pull(user_to_unfollow_object);
        user_to_unfollow_object.followers.pull(user_object);
        await user_to_unfollow_object.save({ session: sess });
        await user_object.save({ session: sess });
        await sess.commitTransaction();
        console.log("Deleted..........................")
    }
    catch(err){
        const error = new HttpError('Something went wrong, could not unfollow user.', 500)
        return next(error)
    }

    res.status(201).json({ user: user_object.toObject({ getters: true }) })
}

const removeUser = async (req, res, next) => {
    const uid = req.params.uid
    let user_to_remove = req.body.user_to_remove;

    let user_to_remove_object;

    try {
        user_to_remove_object = await User.findById(user_to_remove)
        console.log(user_to_remove_object.name)
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete user.', 500)
        return next(error)
    }

    let user_object;

    try {
        user_object = await User.findById(uid)
        console.log(user_object.name)
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete user.', 500)
        return next(error)
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        user_object.followers.pull(user_to_remove_object);
        user_to_remove_object.following.pull(user_object);
        await user_to_remove_object.save({ session: sess });
        await user_object.save({ session: sess });
        await sess.commitTransaction();
        console.log("Deleted..........................")
    }
    catch (err) {
        const error = new HttpError('Something went wrong, could not delete user.', 500)
        return next(error)
    }

    res.status(201).json({ user: user_object.toObject({ getters: true }) })
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.followUser = followUser;
exports.unfollowUser = unfollowUser;
exports.removeUser = removeUser;