const apiRoute = require('./api')

const conMethod = (app) => {
    app.use('/api', apiRoute);
  
    app.use('*', (req, res) => {
      res.status(404).json({ error: 'Not found' });
    });
  };
  
module.exports = {
    conMethod
};