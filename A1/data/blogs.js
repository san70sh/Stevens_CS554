const mongoCollections = require('../config/mongoCollections')
const blogs = mongoCollections.blogs;
const users = mongoCollections.users;
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const saltRounds = 16;

function CustomError (status, message) {
    this.status = status;
    this.message = message;
}

function checkParams(label, data, type) {
    if(!data) throw new CustomError(400,`Please enter ${label}`);
    if(typeof(data) !== type) throw new CustomError(400,`${label} is not of type ${type}`);
    if(type === 'string') data = data.trim();
    if(data == '') throw new CustomError(400,`Please enter ${label}`);
    
}

async function createUser(username, name, password) {
    //Username validation
    let re = /^[a-z0-9]*$/im
    if(username == "" || username == undefined) throw new CustomError(400,"Please enter your username.");
    if(username.length < 4) throw new CustomError(400,"The username is too short.");
    if(!re.test(username)) throw new CustomError(400,`${username} is not a valid username.`);
    
    username = username.toLowerCase();

    //Name validation
    let re2 = /^[a-z ]*$/im
    if(name == "" || name == undefined) throw new CustomError(400,"Please enter your name.");
    if(!re2.test(name)) throw new CustomError(400,`${name} is not a valid name.`);
    

    //password validation
    let re3 = /\s/i
    if(!password) throw new CustomError(400,`Please enter your password`);
    if(re3.test(password)) throw new CustomError(400,"Spaces are not allowed in passwords.");

    const usrsCollection = await users();
    let dupUser = await usrsCollection.findOne({"username": username})
    if(dupUser == null){
        let newUser = {
            username: username,
            name: name,
            password: await bcrypt.hash(password, saltRounds)
        }

        const insertInfo = await usrsCollection.insertOne(newUser);
        if (!insertInfo.insertedId) {
            throw new CustomError(500,"Internal Server Error");
        } else {
            const newId = insertInfo.insertedId;
            let returnObj = await this.getUser(newId.toString());
            return returnObj;
        }
    } else {
        throw new CustomError(400,`Username with ${name} already exists in the database.`);
    } 

}

async function getUser(id) {
    checkParams("ID", id, 'string');
    id = id.trim();
    
    if(ObjectId.isValid(id)){
        let objId = new ObjectId(id);
        const usrsCollection = await users();
        const user = await usrsCollection.findOne({ _id: objId },{projection: {password: 0}});
        if (user === null) throw new CustomError(400,"There is no user with that username.");
        user["_id"] = user["_id"].toString();
        return user;
    } else throw new CustomError(400,`${id} is not a valid ID`);
  }


async function checkUser(username, password) {
    //Username validation
    let re = /^[a-z0-9]*$/im
    if(username == "" || username == undefined) throw new CustomError(400,"Please enter your username.");
    if(!re.test(username)) throw new CustomError(400,`${username} is not a valid username.`);
    username = username.toLowerCase();

    //password validation
    let re2 = /\s/i
    if(!password) throw new CustomError(400, `Please enter your password`);
    if(re2.test(password)) throw new CustomError(400,"Spaces are not allowed in passwords.");

    let authenticated = false;
    const usrsCollection = await users();
    let validateUser = await usrsCollection.findOne({"username": username})
    if(validateUser == null) throw new CustomError(400,"There is no user with that username.");
    else {
        if(await bcrypt.compare(password, validateUser.password)){
            let returnObj = {_id: validateUser._id, username: validateUser.username, name: validateUser.name};
            authenticated = true;
            return {returnObj, auth: authenticated};
        } else throw new CustomError(400,"Either the username or password is invalid");
    }
}

async function createPost(title, body, username, userId) {
    //title validation
    if(title == undefined || title.trim().length == 0 ) throw new CustomError(400,"Please enter a blog title.");

    //body validation
    if(body == undefined || body.trim().length == 0) throw new CustomError(400,"Please enter a blog post.");

    //Username validation
    let re = /^[a-z0-9]*$/im
    if(username == "" || username == undefined) throw new CustomError(400,"Please enter your username.");
    if(!re.test(username)) throw new CustomError(400,`${username} is not a valid username.`);
    username = username.toLowerCase();

    if(ObjectId.isValid(userId)) {
        const blogCollection = await blogs();
        let newPost = {
            title: title,
            body: body,
            userThatPosted: {_id: new ObjectId(userId), username: username},
            comments: []
        }
    
        const insertInfo = await blogCollection.insertOne(newPost);
        if (!insertInfo.insertedId) {
            throw new CustomError(500,"Internal Server Error");
        } else {
            const newId = insertInfo.insertedId;
            let returnObj = await this.getPost(newId.toString());
            return returnObj;
        }
    } else throw new CustomError(400,"Invalid User Id");
}

async function getPost(id) {
    checkParams("ID", id, "string");
    id = id.trim();
    
    if(ObjectId.isValid(id)){
        let objId = new ObjectId(id);
        const blogCollection = await blogs();
        const post = await blogCollection.findOne({ _id: objId });
        if (post === null) throw new CustomError(400,"There is no blog post available with this ID.");
        post["_id"] = post["_id"].toString();
        post.userThatPosted["_id"] = post.userThatPosted["_id"].toString();
        if(post.comments.length != 0) {
            post.comments.forEach(e => {
                e._id = e._id.toString();
                e.userThatPostedComment._id = e.userThatPostedComment._id.toString();
            });
        }
        return post;
    } else throw new CustomError(400,`${id} is not a valid ID`);
}

async function getAllPosts(skip, take) {
    if(take == undefined || take == '') take = 20;
    if(skip == undefined || skip == '') skip = 0;
    if ((skip!= undefined && isNaN(skip)) || ( skip && skip < 0)) throw new CustomError(400, "Invalid skip querystring parameter");
    if ((take!= undefined && isNaN(take)) || (take && take < 0)) throw new CustomError(400, "Invalid take querystring parameter");
    if(take > 100) take = 100;
    const blogCollection = await blogs();
    const postList = await blogCollection.find({ }).limit(take).skip(skip).toArray();
    postList.forEach(e => {
        e["_id"] = e["_id"].toString();
        e.userThatPosted["_id"] = e.userThatPosted["_id"].toString();
    })
    return postList;
}

async function getUserId(postId) {
    if(postId == "" || postId == undefined) throw new CustomError(400,"Please enter a post ID.");
    if(ObjectId.isValid(postId)) {
        let post = await getPost(postId);
        return post.userThatPosted._id;
    }
}

async function updatePost(postId, userId, details, hverb) {
    let {title, body} = details;
    let blogpost;

    if(title) checkParams("Post Title", title, "string");
    if(body) checkParams("Post Body", body, "string");

    if(postId == "" || postId == undefined) throw new CustomError(400,"Please enter a post ID.");
    if(ObjectId.isValid(postId)) {
        let post = await getPost(postId);
        if(post){
            if(post.userThatPosted._id === userId) {
                const blogCollection = await blogs();
                if(hverb == "put") {
                    let newPost = {
                        title: title,
                        body: body,
                        userThatPosted: post.userThatPosted,
                        comments: post.comments
                    }
                    let updatedPost = blogCollection.replaceOne({_id: new ObjectId(postId)}, newPost);
                    if(updatedPost.modifiedCount === 0) throw new CustomError(500,"Internal Server Error");
                    else {
                        blogpost = await getPost(postId);
                        return blogpost;
                    }
                } else {
                    if(title) {
                        if(title != post.title) {
                            let updatedPost = blogCollection.updateOne({_id: new ObjectId(postId)}, {$set: {title: title}});
                            if(updatedPost.modifiedCount === 0) throw new CustomError(500,"Internal Server Error");
                            else {
                                blogpost = await getPost(postId);
                            }
                        } else throw new CustomError(400, "No delta in post title"); 
                    }  
    
                    if(body) {
                        if(body != post.body) {
                            let updatedPost = blogCollection.updateOne({_id: new ObjectId(postId)}, {$set: {body: body}});
                            if(updatedPost.modifiedCount === 0) throw new CustomError(500,"Internal Server Error");
                            else {
                                blogpost = await getPost(postId);
                            }
                        } else throw new CustomError(400, "No delta in post body"); 
                    }
                }
                return blogpost;

            } else throw new CustomError(403, "Unauthorized to modify post");
        } else throw new CustomError(400, `No post found with ID ${postId}`);
    }
}

async function postComment(comment, username, userId, postId) {
    //Comment Validation
    checkParams("Comment", comment, "string");

    //Username validation
    let re = /^[a-z0-9]*$/im
    if(username == "" || username == undefined) throw new CustomError(400,"Please enter your username.");
    if(!re.test(username)) throw new CustomError(400,`${username} is not a valid username.`);
    username = username.toLowerCase();

    //PostID validation
    if(postId == "" || postId == undefined) throw new CustomError(400,"Please enter a post ID.");
    if(ObjectId.isValid(userId) && ObjectId.isValid(postId)) {

        let newComment = {
            _id: new ObjectId(),
            userThatPostedComment: {_id: new ObjectId(userId), username: username},
            comment: comment
        }
        const blogCollection = await blogs();
        let post = await getPost(postId);
        if(post) {
            postId = new ObjectId(postId);
            const postNewComment = await blogCollection.updateOne({ _id: postId }, { $push: { comments: newComment } });
            if (postNewComment.modifiedCount === 0) {
                throw new CustomError(500,"Internal Server Error");
            } else {
                let blogpost = await getPost(postId.toString());
                return blogpost;
            }
        }
    }
}

async function getCommentUserId(postId, commentId) {
    if(postId == "" || postId == undefined) throw new CustomError(400,"Please enter a post ID.");
    if(commentId == "" || commentId == undefined) throw new CustomError(400,"Please enter a comment ID.");
    if(ObjectId.isValid(commentId) && ObjectId.isValid(postId)) {
        let post = await getPost(postId);
        let comment = post.comments.find(e => e._id == commentId);
        if(comment) return comment.userThatPostedComment._id;
        else throw new CustomError(400, "Comment not found");
    }
}
async function deleteComment(commentId, postId, userId) {
    if(commentId == "" || commentId == undefined) throw new CustomError(400,"Please enter a comment ID.");
    if(postId == "" || postId == undefined) throw new CustomError(400,"Please enter a post ID.");
    if(ObjectId.isValid(commentId) && ObjectId.isValid(postId) && ObjectId.isValid(userId)) {
        const blogCollection = await blogs();
        let post = await getPost(postId);
        if(post) {
            let comment = post.comments.find(e => e["_id"] == commentId);
            if(comment){
                if(comment.userThatPostedComment._id == userId) {
                    let postInfo = await blogCollection.updateOne({_id: new ObjectId(postId) }, {$pull: { comments: {_id: new ObjectId(commentId) } } });
                    if(postInfo.modifiedCount === 0) throw new CustomError(500, "Internal Server Error");
                    else return `Comment ${commentId} in the post has been successfully deleted.`;
                } else throw new CustomError(403, "Unauthorized to delete comment");
            } else throw new CustomError(400, "Comment not found.");
        }
    } else {
        if(!ObjectId.isValid(commentId)) throw new CustomError(400,"Invalid comment ID.");
        if(!ObjectId.isValid(postId)) throw new CustomError(400,"Invalid post ID.");
        else throw new CustomError(400,"Invalid user ID.");
    }

}

module.exports = {
    createUser,
    checkUser,
    getUser,
    createPost,
    getPost,
    postComment,
    deleteComment,
    updatePost,
    getAllPosts,
    updatePost,
    getUserId,
    getCommentUserId
}