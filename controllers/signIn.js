const handleSignIn = (req, res, bCrypt, db) => {
	const { email,password } = req.body;
	if (!email || !password) {
		return res.status(400).json('unable to register');
	}
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
}

module.exports = {
	handleSignIn
}