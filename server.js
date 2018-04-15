const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({credentials: true, origin: true}));

const PORT = process.env.PORT;
const bodyParser = require('body-parser');
const bCrypt = require('bcrypt-nodejs');
const db = require('knex')({
	client: 'pg',
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: true,
	}
});
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const register = require('./controllers/register');
const signIn = require('./controllers/signIn');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

app.get('/', (req, res) => { res.send('it is working!') });
app.post('/signin', (req,res) => { signIn.handleSignIn(req, res, bCrypt, db) });
app.post('/register', cors(), (req, res) => { register.handleRegister(req, res, db, bCrypt) });
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });
app.put('/image', (req, res) => { image.handleImage(req, res, db) });
app.post('/imageurl', (req, res) => { image.handleAPICall(req, res) });

app.listen(PORT || 3000, ()=> {
	console.log('running smooth!');
});

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userIf --> GET = user
/image --> PUT --> user

*/
