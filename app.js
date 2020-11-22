const expr= require('express');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');

const port = 3000
const app = expr()

const DHOFOLIOpool = mysql.createPool({
  connectionLimit: 10, 
  password: 'AyGcSvTh1GyH2ilwU7bH+_(1', 
  user: 'root',
  database: 'DHOFOLIO',
  host: '192.168.1.2',
  port: '3308' 
});

var DHOFOLIOresults = {};


DHOFOLIOresult = (MySqlSPROCNameIn) => {
  return new Promise( (resolve, reject) => {
    DHOFOLIOpool.query('CALL ' + MySqlSPROCNameIn, (err, results) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(results);
      }
    });
  });
};

app.get('/', (req, res) => {
  res.json({
    Message: 'API for DHO-FOLIO application!'
  });
});

app.post('/api/:id', verifyToken, (req, res) => {
  jwt.verify(req.token, 'TheSecretKey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      DHOFOLIOresult(req.params.id)
      .then((value) => {
          res.json({
            // message: 'Post created....',
            // authData: authData,
            Databack: value
          });
      })
      .catch(err => {
          // Return default code for HTTP "Not Found" (=404) 
          res.sendStatus(404);
      });
    }
  });
});

app.post('/login', (req, res) => {
  // Mock user, must be replaced by code that does full autentication (get user id/name/password and validate against a source)
  const user = {
    id: 1,
    username: 'JosB' ,
    email: 'jos@deheleolifant.com'  
  }

  jwt.sign({user: user}, 'TheSecretKey', { expiresIn: '24h' }, (err, token) => {
    res.json({
      token: token
    });
  });
}); 


function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined' ) {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}



app.listen(process.env.port || port, () => {
  console.log(`Example app listening at http://localhost: ${process.env.port} || ${port}`)
})