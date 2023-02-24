const { uuid } = require('uuidv4');
const HttpError = require('../models/http-error')
const Place = require('../models/place_model')
const User = require('../models/user_model')
const Post = require('../models/post_model')
const mongoose = require('mongoose')

const getPost = async (req, res, next) => {
    const userId = req.params.uid //Obtain the userId from the request -> Encoded in the URL
    const PlaceId = req.params.pid //Obtain the userId from the request -> Encoded in the URL

    console.log("Hello")

    let posts;
    try {
        posts = await Post.find({ postedIn: PlaceId })
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a post.', 500)
        return next(error)
    }

    if (!posts) {
        // console.log("No place found")
        const error = new HttpError('Could not find any post.', 404)
        return next(error)
    }

    res.json({ posts: (await posts).map(post => post.toObject({ getters: true })) })
    // console.log("GET Request to the homepage -> Places_routes");
}

//Write code to get a post by post_id
const getPostById = async (req, res, next) => {
    const postId = req.params.post_id //Obtain the userId from the request -> Encoded in the URL

    let post;
    try {
        post = await Post.findById(postId)
    }
    catch (err) {
        const error = new HttpError('Something went wrong, could not find a post.', 500)
        return next(error)
    }

    if (!post) {
        // console.log("No place found")
        const error = new HttpError('Could not find any post.', 404)
        return next(error)
    }

    res.json({ post: post.toObject({ getters: true }) })
}

/*Write code to save a post to the user who is logged in*/
const savePost = async (req, res, next) => {
    const userId = req.params.uid //Obtain the userId from the request -> Encoded in the URL
    const postId = req.body.post_id //Obtain the userId from the request -> Encoded in the URL

    let user;
    try {
        user = await User.findById(userId)
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a user.', 500)
        return next(error)
    }

    let post;
    try {
        post = await Post.findById(postId)
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a post.', 500)
        return next(error)
    }

    // console.log(user.saved_posts + " 53")
    console.log(postId)

    try {
        if (!user.saved_posts.includes(postId)) {
            user.saved_posts.push(postId)
        }
        await user.save()
    } catch (err) {
        const error = new HttpError('Something went wrong, could not save a post.', 500)
        return next(error)
    }

    console.log("Saved Post")

    res.status(201).json({ user: user.toObject({ getters: true }) })
}

const createPost = async (req, res, next) => {
    const u_id = req.params.uid //Obtain the User Id from the request -> Encoded in the URL
    const p_id = req.params.pid //Obtain the Place Id from the request -> Encoded in the URL

    let { title, description } = req.body //Destructuring the body
    /*We Have to obain Posted in, Upvotes, Downvotes seperately*/

    try {
        place = await Place.findById(p_id)
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a place.', 500)
    }

    try {
        user = await User.findById(u_id)
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a user.', 500)
    }

    console.log(place.bannedKeyWords)

    //Splite the place.bannedKeyWords into an array over , 

    const bannedKeyWords = place.bannedKeyWords.split(",")
    console.log(bannedKeyWords)

    // Convert title and description to lowercase
    const lowerTitle = title.toLowerCase();
    const lowerDescription = description.toLowerCase();

    // Check if the title or description contains any of the banned keywords
    for (let i = 0; i < bannedKeyWords.length; i++) {
        const keyword = bannedKeyWords[i].toLowerCase();
        if (lowerTitle.includes(keyword) || lowerDescription.includes(keyword)) {
            // If it does, replace all occurrences of the keyword with a string of * of length equal to the length of the banned keyword
            const pattern = new RegExp(keyword, "gi");
            title = title.replace(pattern, "*".repeat(keyword.length));
            description = description.replace(pattern, "*".repeat(keyword.length));
        }
    }

    const createdPost = new Post({
        title: title,
        description: description,
        postedBy: u_id,
        postedIn: p_id
    })

    try {
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await createdPost.save({ session: sess })
        place.posts.push(createdPost)
        await place.save({ session: sess })
        await sess.commitTransaction()
    } catch (err) {
        new HttpError('Something went wrong, could not create a post.', 500)
    }

    res.status(201).json({ post: createdPost })
}

/*Write a function to add a user to the Upvotes array in a given post */
const UpvotePost = async (req, res, next) => {
    const u_id = req.params.uid //Obtain the User Id from the request -> Encoded in the URL
    const p_id = req.params.post_id //Obtain the Post Id from the request -> Encoded in the URL

    let post;
    try {
        post = await Post.findById(p_id)
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a post.', 500)
        return next(error)
    }

    if (!post) {
        const error = new HttpError('Could not find a post for the provided id.', 404)
        return next(error)
    }

    try {
        if (!post.Upvotes.includes(u_id)) {
            post.Upvotes.push(u_id)
        }
        await post.save()
    } catch (err) {
        new HttpError('Something went wrong, could not upvote a post.', 500)
    }

    res.status(201).json({ post: post })
}

/*Write a function to add a user to the Downvotes array in a given post */
const DownvotePost = async (req, res, next) => {
    const u_id = req.params.uid //Obtain the User Id from the request -> Encoded in the URL
    const p_id = req.params.post_id //Obtain the Place Id from the request -> Encoded in the URL

    let post;
    try {
        post = await Post.findById(p_id)
    }
    catch (err) {
        const error = new HttpError('Something went wrong, could not find a post.', 500)
        return next(error)
    }

    if (!post) {
        const error = new HttpError('Could not find a post for the provided id.', 404)
        return next(error)
    }

    try {
        if (!post.Downvotes.includes(u_id)) {
            post.Downvotes.push(u_id)
        }
        await post.save()
    } catch (err) {
        new HttpError('Something went wrong, could not downvote a post.', 500)
    }

    res.status(201).json({ post: post })
}

/*Get the Saved posts */
const getsavedPosts = async (req, res, next) => {
    const userId = req.params.uid //Obtain the userId from the request -> Encoded in the URL

    let user;
    try {
        user = await User.findById(userId)
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a user.', 500)
        return next(error)
    }

    if (!user) {
        // console.log("No place found")
        const error = new HttpError('Could not find saved Posts.', 404)
        return next(error)
    }

    let posts = [];

    console.log(user)

    for (const postId of user.saved_posts) {
        try {
            const post = await Post.findById(postId);
            posts.push(post);
        } catch (err) {
            console.log(err);
        }
    }
    console.log(posts)

    res.json({ posts: (await posts).map(post => post.toObject({ getters: true })) })
}

/*Delete the saved posts */
const deleteSavedPost = async (req, res, next) => {
    console.log("Delete Saved Post")
    const postId = req.params.post_id //Obtain the Post Id from the request -> Encoded in the URL
    const userId = req.params.uid //Obtain the User Id from the request -> Encoded in the URL

    let user;
    try {
        user = await User.findById(userId)
    }
    catch (err) {
        const error = new HttpError('Something went wrong, could not find a user.', 500)
        return next(error)
    }

    if (!user) {
        const error = new HttpError('Could not find a user for the provided id.', 404)
        return next(error)
    }

    try {
        user.saved_posts.pull(postId)
        await user.save()
    } catch (err) {
        new HttpError('Something went wrong, could not delete a saved post.', 500)
    }

    res.status(201).json({ user: user })
}


//Create a function to get delete post
const deletePost = async (req, res, next) => {
    console.log("Delete Post")
    const postId = req.params.post_id //Obtain the Post Id from the request -> Encoded in the URL
    const u_id = req.params.uid //Obtain the User Id from the request -> Encoded in the URL

    let post;
    try {
        post = await Post.findById(postId)
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a post.', 500)
        return next(error)
    }

    if (!post) {
        const error = new HttpError('Could not find a post for the provided id.', 404)
        return next(error)
    }

    try {
        const result = await post.remove()
        if (!result) {
            const error = new HttpError('Something went wrong, could not delete a post.', 500)
            return next(error)
        }
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete a post.', 500)
        return next(error)
    }

    res.status(200).json({ message: 'Deleted post.' })

}

exports.createPost = createPost
exports.getPost = getPost
exports.UpvotePost = UpvotePost
exports.DownvotePost = DownvotePost
exports.savePost = savePost
exports.getsavedPosts = getsavedPosts
exports.getPostById = getPostById
exports.deletePost = deletePost
exports.deleteSavedPost = deleteSavedPost