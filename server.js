const express = require('express');
const bodyParser = require('body-parser');
const bCrypt = require('bcrypt-nodejs');
const cors = require('cors');
const db = require('knex')({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: 'nick',
		password: 'nick',
		database: 'smart-brain'
	}
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send(database.users);
});

app.post('/signin', (req, res) => {
	db.select('email', 'hash').from('login')
		.where('email', '=', req.body.email)
		.then(data => {
			const isValid = bCrypt.compareSync(req.body.password, data[0].hash);
			if (isValid) {
				return db.select('*').from('users')
					.where('email', '=', req.body.email)
					.then(user => {
						res.json(user[0])
					})
					.catch(err => res.status(400).json('unable to sign in'));
			} else {
				res.status(400).json('wrong credentials')
			}
		})
		.catch(err => res.status(400).json('unable to sign in'));
});

app.post('/register', (req, res) => {
	const { email,name,password } = req.body;
	const hash = bCrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			hash,
			email,
		})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
					.returning('*')
					.insert({
						email: loginEmail[0],
						name,
						joined: new Date(),
					})
					.then(user => {
						res.json(user[0]);
					})
			})
			.then(trx.commit)
			.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('unable to register'));
});

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	db.select('*').from('users').where({ id })
		.then(user => {
			user.length ?
			res.json(user[0]) :
			res.status(400).json('Not found');
	});
});

app.put('/image', (req, res) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			res.json(entries[0]);
		})
		.catch(err => res.status(400).json('Oh no!'))
});

app.listen(3000, ()=> {
	console.log('running smooth!');
});

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userIf --> GET = user
/image --> PUT --> user

*/
