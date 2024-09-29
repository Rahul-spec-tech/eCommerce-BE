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
					const token = jwt.sign({ user: username, id: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
					res.json({
						username: user.username,
						userId: user._id,
						token: token,
					});
				} 
				else {
					res.status(401).send('Username or password is incorrect');
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

module.exports.checkAuth = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err || !decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        return res.status(200).json({ redirect: '/home' });
    });
};