const express = require('express');
const app = express();
const session = require('express-session');
const configRoutes = require('./routes');
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(
    session({
      name: 'AuthCookie',
      secret: "sessionStorage",
      saveUninitialized: false,
      resave: false,
      cookie: { maxAge: 1000000 }
    })
);

configRoutes.conMethod(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
