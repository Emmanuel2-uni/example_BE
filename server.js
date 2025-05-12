// EXPLANATION FOR MY (STUPID) SELF AND FOR OTHERS
// Aim: lightweight backend implementation through a local server using XAMPP
// Why: for speed
// Needed:
//   Packages: Node, Express, cors, mysql, nodemon, body-parser
//   Node is a requirement, no questions askedd.
//   Express is a javascript framework for handling web requests, http, as middleware, and API creation.
//   mysql is needed since we're going to be making connections and requests to the local XAMPP mySQL database.
//   cors is for stuff. It's needed, but explaining it will take forever.
//   Nodemon lets us dynamically host something even when there are detected file/code changes.
//   body-parser lets us read forms


//Declare all the necessary libraries and frameworks. 
const express = require("express");
const app = express();
const mysql = require("mysql")
const cors = require("cors")
const bodyParser = require('body-parser')


//Declare an environment for our nodemon
const PORT = process.env.PORT || 5001

//Declare what express will be using for communication
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended : true }))

var http = require('http');


//Declare a mysql connection to a specific port. Default port is 3306. 
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'my_db',
});

// Connect to the mysql connection above.
connection.connect();


// connection.query(`SELECT username FROM accounts`, function (error, rows, fields) {
//   if (error) throw error;
//   // console.log('The users are: ', rpw);
//   res.json(rows)
//   console.log(a)
// });



// GET lets you, well, get information from the connection to the mySQL databasers
app.get("/api", (req, res) => {

    connection.query("SELECT * FROM accounts", (err, rows, fields) => {
        if(err) throw err;
        res.json(rows)

    })
})

app.get('/api/usernames', function(req, res){
  var user = req.params.username
  //res.send('id: ' + user);
  console.log(user)
  connection.query(`SELECT username FROM accounts`, (err, rows, fields) => {
    if(err) throw err;
        if(rows.length > 0){
            res.json(rows)
        }else{
            res.status(400).json({msg:`${id} id not found`})
        } 
    }) 
});



app.get('/api/usernames/:username', (req, res) => {
  var username = req.params.username
  //res.send('id: ' + user);
  console.log(username)
  connection.query(`SELECT * FROM accounts WHERE username = "${username}"`, (err, rows, fields) => {
    if(err) throw err;
        if(rows.length > 0){
            res.json(rows)
        }else{
            res.status(400).json({msg:`${id} id not found`})
        } 
    }) 
});




// Try a login system that checks against usernames and passwords inside
//  Note to self: PROMISES CANNOT RETURN BOOLEAN
//  The form will redirect to this function
app.post('/login', (request, response) => {
  let username = request.body.username
  let password = request.body.password

  //res.send('id: ' + user);
  console.log(username)
  console.log(password)

  // Checks if both fields are not empty
  if(username && password){
    connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], (err, rows, fields) => {
        if (err) throw error

        //If something was found, the row is not 0. Redirect to the home page.
        if (rows.length > 0) {
            response.redirect('http://127.0.0.1:3000/home.html')
        }else{
            response.redirect('http://127.0.0.1:3000/login.html')
            // ONLY HAVE ONE RESPONSE PER IF ELSE BLOCK
            // THIS PREVENTS THE CODE FROM TRYING TO FULFILL TWO PROMISES
            //response.send('Incorrect User/Pass')
        }
        //response.end();
    });
  } else {
    response.redirect('http://127.0.0.1:3000/login.html')
    //response.send('Enter username and password.')
  } 
    
});


app.post('/register', (request, response) => {
  let username = request.body.username_r
  let password = request.body.password_r

  //res.send('id: ' + user);
  console.log(username)
  console.log(password)

  // Checks if both fields are not empty
  if(username && password){
    connection.query(`INSERT INTO accounts (username, password, user_ID) VALUES ('${username}', '${password}', NULL)`, (err, rows, fields) => {
        //INSERT INTO `accounts` (`username`, `password`, `user_ID`) VALUES ('Egg', '333', NULL)
        if (err) throw error
        //If something was found, the row is not 0. Redirect to the home page.
        if (rows.length > 0) {
            response.redirect('http://127.0.0.1:3000/login.html')
        }else{
            response.redirect('http://127.0.0.1:3000/login.html')
            // ONLY HAVE ONE RESPONSE PER IF ELSE BLOCK
            // THIS PREVENTS THE CODE FROM TRYING TO FULFILL TWO PROMISES
            //response.send('Incorrect User/Pass')
        }
        //response.end();
    });
  } else {
    response.redirect('http://127.0.0.1:3000/login.html')
    //response.send('Enter username and password.')
  } 
});


// Just a console log to make sure that the server is indeed running at specified env port.
app.listen(5001, () => {
    console.log(`Server is running in port ${PORT}`);
})
