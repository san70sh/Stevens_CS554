const blogRoute = require('./blogs')
const blogData = require('../data/blogs')
const conMethod = (app) => {
    app.use('/blog/logout', (req, res) => {
        if(req.session.username){
            req.session.destroy();
            return res.status(200).send("You have been successfully logged out.")
        } else {
            return res.status(400).send("Please log in to log out.")
        }
    });

    app.post('/blog', (req, res, next) => {
        if(req.session.username) next();
        else res.status(403).send("Please login to continue");
    });
    app.put('/blog/:id', async (req, res, next) => {
    if(req.session.username) {
        let postOwner = await blogData.getUserId(req.params.id);
        if(req.session.userId == postOwner) {
            next();
        } else res.status(403).send("Unauthorized user.");
    } else res.status(403).send("Please login to continue");
    });
    
    app.patch('/blog/:id', async (req, res, next) => {
    if(req.session.username){
        let postOwner = await blogData.getUserId(req.params.id);
        
        if(req.session.userId == postOwner) {
            next();
        } else res.status(403).send("Unauthorized user.");
    } else res.status(403).send("Please login to continue");
    });
    
    app.delete('/blog/:blogId/:commentId', async (req, res, next) => {
        try {
            if(req.session.username){
                let commentOwner = await blogData.getCommentUserId(req.params.blogId,req.params.commentId);
                if(req.session.userId == commentOwner) next();
                else res.status(403).send("Unauthorized user.");
            }
            else res.status(403).send("Please login to continue");
        } catch (e) {
            res.status(e.status).send(e.message);
        }
    });
    
    app.use('/blog', blogRoute);
    app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = {
    conMethod
};