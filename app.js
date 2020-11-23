const https = require('https');
const fs = require('fs');
const expr= require('express');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');

const port = 3001
const app = expr()

const credentials = {
  key: fs.readFileSync('./IN/dekknetcom.key'),
  cert: fs.readFileSync('./IN/f938ed46a07d9d5d.crt')
};

//TODO: Onderstaande gegevens nog te vervangen door de juiste (productie) gegevens FDE 21-11-2020
const DHOFOLIOpool = mysql.createPool({
  connectionLimit: 10, 
  password: 'AyGcSvTh1GyH2ilwU7bH+_(1', 
  user: 'root',
  database: 'DHOFOLIO',
  host: 'localhost',
  port: '3308' 
});
 

// Deze functie krijgt de naam van een Sproc en stuurt deze naar de database om de gegevens uit de database te halen
DHOFOLIOresult = (MySqlSPROCNameIn) => {
  console.log('In DHOFOLIOresult');
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

// Root van de API
app.get('/', (req, res) => {
  console.log('In app.get');
  res.json({
    Message: 'API for DHO-FOLIO application!'
  });
});


// Deze functie vangt een POST request met URL /api/sproc op en haalt de naam van de sproc uit parameter :id 
// van de url waarna functie DHOFOLIOresult met de naam van de sproc als parameter uitgevoerd wordt om de gegevens 
// uit de database te halen. De functie verifyToken wordt gebruikt om deze url middels een token te beschermen
// tegen onbedoelde toegang.
// --------------------------------------------

//TODO: nog inbouwen dat aan de Sproc zelf ook parameters meegegeven kunnen worden
app.post('/api/sproc/:id', verifyToken, (req, res) => {
  console.log('In app.post /api/sproc/:id' );
  jwt.verify(req.token, '<TheSecretKey>', (err, authData) => {
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


// Deze functie biedt login mogelijkheden om daarmee vervolgens een token op te halen die nodig zijn om bepaalde url's te kunen aanroepen.
// Deze functie maakt nog gebruik van een mock user en moet nog vervangen worden door code welke volledige autenticatie doet
// Boilerplate= get user id/name/password en valideer dat tegen een bron.
//TODO: reguliere authenticatie code schrijven om bv de <TheSecretKey> te bewaren en op te kunnen halen
app.post('/api/login', (req, res) => {
  console.log('In app.post /api/login');

  const user = {
    id: 1,
    username: 'JosB' ,
    email: 'jos@deheleolifant.com'  
  }

  // Deze functie maakt/haalt een token obv eerdere autheticatie (zie hierboven).
  jwt.sign({user: user}, '<TheSecretKey>', { expiresIn: '24h' }, (err, token) => {
    res.json({
      token: token
    });
  });
}); 

// Deze functie verificeert een token en wordt gebruikt bij het "opvangen" van url's om te bepalen of er antwoord op gegeven mag worden.
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


// Deze aanroep creert een https server met TLS
var httpsServer = https.createServer(credentials, app);

// Deze aanroept zorgt dat de hierboven gecreerde server gaat luisteren
httpsServer.listen(port), () => { console.log("SSL Server stareted to listen on port: " +  port)};
