const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const blogData = require('../data/blogs');

router.post('/', async(req, res) => {
    try {
        if(req.session.username) {
            let {title, body} = req.body;
            let username = req.session.username;
            let userId = req.session.userId;
            //title validation
            if(title == undefined || title.trim().length == 0 ) {
                return res.status(400).send("Please enter a blog title.");
            }
    
            //body validation
            if(body == undefined || body.trim().length == 0) {
                return res.status(400).send("Please enter a blog post.");
            }
    
            let output = await blogData.createPost(title, body, username, userId);
            if(output) return res.status(200).json(output);
        } else {
            return res.status(403).send("Please login to continue")
        }
    } catch(e) {
        console.log(e);
        return res.status(e.status).send(e.message);
    }
});

router.get('/:id', async(req, res) => {
    try {
        let postId = req.params.id.trim();
        if(ObjectId.isValid(postId)) {
            let output = await blogData.getPost(postId);
            return res.status(200).json(output);
        } else {
            res.status(400).json({message: 'Please enter a valid ID'})
            return;
        }
    } catch (e) {
        console.log(e);
        return res.status(err.status).send(err.message);
    }

})

router.get('/', async(req, res) => {
    try {
        let skip, take;
        if(req.query){
            if(req.query.skip) skip = parseInt(req.query.skip);
            if(req.query.take) take = parseInt(req.query.take);
        }

        //skip and take validation
        if ((skip!= undefined && isNaN(skip)) || ( skip && skip < 0)) return res.status(400).send("Invalid skip querystring");
        if ((take!= undefined && isNaN(take)) || (take && take < 0)) return res.status(400).send("Invalid take querystring"); 
        
        let output = await blogData.getAllPosts(skip, take);
        if(output) return res.status(200).json(output);

    } catch(e) {
        console.log(e);
        res.status(500).send();
    }
})

router.put('/:id', async (req, res) => {
    try {
        if(req.session.username){
            let details = req.body;
            let userId = req.session.userId;
            let postId = req.params.id;
    
            //title validation
            if(details.title == undefined || details.title.trim().length == 0 ) {
                return res.status(400).send("Please enter a blog title.");
            }
    
            //body validation
            if(details.body == undefined || details.body.trim().length == 0) {
                return res.status(400).send("Please enter a blog post.");
            }
            let output = await blogData.updatePost(postId, userId, details, "put");
            if(output) return res.status(200).json(output);
        } else {
            return res.status(403).send("Please login to continue")
        }
    } catch (e) {
        console.log(e);
        return res.status(e.status).send(e.message);
    }
});

router.patch('/:id', async (req, res) => {
    try {
        if(req.session.username){
            let postUpdate = req.body;
            let userId = req.session.userId;
            let postId = req.params.id;
            let title, body;
            console.log(postUpdate)
            if(postUpdate.title) {
                 //title validation
                if(postUpdate.title == undefined || postUpdate.title.trim().length == 0 ) {
                    return res.status(400).send("Please enter a blog title.");
                }
                title = postUpdate.title;
            }
        
            if(postUpdate.body) {
                //body validation
                if(postUpdate.body == undefined || postUpdate.body.trim().length == 0) {
                    return res.status(400).send("Please enter a blog post.");
                }
                body = postUpdate.body;
            }
        
            let details = {title, body}; 
            let output = await blogData.updatePost(postId, userId, details, "patch");
            if(output) return res.status(200).json(output);
        } else {
            return res.status(403).send("Please login to continue")
        }
    } catch (e) {
        console.log(e);
        return res.status(e.status).send(e.message);
    }
})

router.post('/signup', async (req, res) => {
    try {
        let {username, name, password} = req.body;
        let re = /^[a-z0-9@$_-]*$/im
        
        //Username validation
        if(username == undefined || username.trim().length == 0 ) {
            return res.status(400).send("Please enter a username.");
        }
        if(!re.test(username)) {
            return res.status(400).send(`${username} is not a valid username.`);
        }

        username = username.toLowerCase();

        //password validation
        let re2 = /\s/i
        if(password == undefined || password.length == 0 ) {
            return res.status(400).send("Please enter a password.");
        }
        if(re2.test(password)) {
            return res.status(400).send("Spaces are not allowed in passwords.");
        }

        //Name validation
        let re3 = /^[a-z ]*$/im
        if(name == undefined || name.trim().length == 0 ) {
            return res.status(400).send("Please enter a valid name.");
        }
        if(!re3.test(name)) {
            return res.status(400).send(`${username} is not a valid name.`);
        }

        let output = await blogData.createUser(username, name, password);
        if(output) return res.status(200).json(output);


    } catch(e){
        console.log(e);
        return res.status(e.status).send(e.message);
    }
})

router.post('/login', async (req, res) => {
    try {
        let {username, password} = req.body;
        let re = /^[a-z0-9@$_-]*$/im
        
        //Username validation
        if(username == undefined || username.trim().length == 0 ) {
            return res.status(400).send("Please enter a valid username.");
        }
        if(!re.test(username)) {
            return res.status(400).send(`${username} is not a valid username.`);
        }

        username = username.toLowerCase();

        //password validation
        let re2 = /\s/i
        if(password == undefined || password.length == 0 ) {
            return res.status(400).send("Please enter a password.");
        }
        if(re2.test(password)) {
            return res.status(400).send("Spaces are not allowed in passwords.");
        } 

        let output = await blogData.checkUser(username, password);
        if(output) {
            if(output.auth) {
                req.session.username = username;
                req.session.userId = output.returnObj._id;
                return res.status(200).json(output.returnObj);
            }
        } 
    } catch(e){
        console.log(e);
        return res.status(e.status).send(e.message);
    }
})

router.post('/:id/comments',async (req,res) => {
    try {
        if(req.session.username) {
            let {comment} = req.body;
            let username = req.session.username;
            let postId = req.params.id;
            let userId = req.session.userId;

            //Username validation
            if(username == undefined || username.trim().length == 0 ) {
                return res.status(400).send("Please enter a valid username.");
            }
            let re = /^[a-z0-9]*$/im;
            if(!re.test(username)) {
                return res.status(400).send(`${username} is not a valid username.`);
            }

            username = username.toLowerCase();

            //comment validation
            if(comment == undefined || comment.trim().length == 0) {
                return res.status(400).send("Please enter a blog post.");
            }

            if(ObjectId.isValid(userId) && ObjectId.isValid(postId)) {
                let output = await blogData.postComment(comment, username, userId, postId);
                return res.status(200).json(output);
            } else {
                if(!ObjectId.isValid(userId)) return res.status(400).send("Invalid User ID")
                else return res.status(400).send("Invalid Post ID");
            }
        
        } else {
            return res.status(403).send("Please login to continue")
        }
    } catch (e) {
        console.log(e);
        return res.status(e.status).send(e.message);
    }
})

router.delete('/:blogId/:commentId', async(req, res) => {
    try {
        if(req.session.username) {
            let postId = req.params.blogId;
            let commentId = req.params.commentId;
            let userId = req.session.userId;

            if(ObjectId.isValid(postId) && ObjectId.isValid(commentId) && ObjectId.isValid(userId)) {
                let output = await blogData.deleteComment(commentId, postId, userId);
                return res.status(200).json(output);
            } else {
                if(!ObjectId.isValid(commentId)) return res.status(400).send("Invalid Comment ID")
                if(!ObjectId.isValid(postId)) return res.status(400).send("Invalid Post ID");
                else return res.status(400).send("Invalid User ID");
            }
        } else {
            return res.status(403).send("Please login to continue")
        }
        
    } catch (e) {
        console.log(e);
        return res.status(e.status).send(e.message);
    }


})
module.exports = router;