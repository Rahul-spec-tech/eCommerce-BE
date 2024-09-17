const User = require('../model/user');

module.exports.getAllUser = (req, res) => {
    const limit = Number(req.query.limit) || 0;
    const sort = req.query.sort === 'desc' ? -1 : 1;

    User.find()
        .limit(limit)
        .sort({ _id: sort })
        .then(users => res.json(users))
        .catch(err => {
            console.error('Failed to fetch users:', err.message);
            res.status(500).json({ error: 'Failed to fetch users' });
        });
};

module.exports.getUser = (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    User.findOne({ _id: id })
        .then(user => {
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        })
        .catch(err => {
            console.error('Failed to fetch user:', err.message);
            res.status(500).json({ error: 'Failed to fetch user' });
        });
};

module.exports.addUser = (req, res) => {
    if (!req.body) return res.status(400).json({ error: 'Data is undefined' });

    const user = new User(req.body);

    user.save()
        .then(newUser => res.json(newUser))
        .catch(err => {
            console.error('Failed to add user:', err.message);
            res.status(500).json({ error: 'Failed to add user' });
        });
};

module.exports.updateUser = (req, res) => {
    const id = req.params.id;

    if (!id || !req.body) return res.status(400).json({ error: 'Invalid request' });

    User.findOneAndUpdate({ _id: id }, req.body, { new: true })
        .then(updatedUser => {
            if (!updatedUser) return res.status(404).json({ error: 'User not found' });
            res.json(updatedUser);
        })
        .catch(err => {
            console.error('Failed to update user:', err.message);
            res.status(500).json({ error: 'Failed to update user' });
        });
};

module.exports.deleteUser = (req, res) => {
    const id = req.params.id;

    if (!id) return res.status(400).json({ error: 'ID is required' });

    User.findOneAndDelete({ _id: id })
        .then(deletedUser => {
            if (!deletedUser) return res.status(404).json({ error: 'User not found' });
            res.json({ status: 'User deleted successfully' });
        })
        .catch(err => {
            console.error('Failed to delete user:', err.message);
            res.status(500).json({ error: 'Failed to delete user' });
        });
};
