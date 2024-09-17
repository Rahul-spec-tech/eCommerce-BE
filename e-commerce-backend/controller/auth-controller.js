const User = require('../model/user');
const jwt = require('jsonwebtoken');

module.exports.login = (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	if (username && password) {
		User.findOne({
			username: username,
			password: password,
		})
			.then((user) => {
				if (user) {
					const token = jwt.sign({ user: username, id: user._id }, 'secret_key', { expiresIn: '1h'});
					res.json({
						username: user.username,
						userId: user._id,
						token: token,
					});
				} 
				else {
					res.status(401);
					res.send('username or password is incorrect');
				}
			})
			.catch((err) => {
				console.error(err);
				res.status(500).json({ error: 'Internal server error' });
			});
	} 
	else {
		res.status(400).json({ error: 'Username and password are required' });
	}
};
