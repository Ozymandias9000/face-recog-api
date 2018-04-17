const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: 'a5a53cb78979422d849ad773ed67c4af'
});

const handleAPICall = (req, res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
	.then(data => {
		console.log(data);
		res.json(data);
	})
	.catch(err => res.status(400).json('unable to work with API'))
}

const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			res.json(entries[0]);
		})
		.catch(err => res.status(400).json("Oh no!"))
}

module.exports = {
	handleImage,
	handleAPICall
}