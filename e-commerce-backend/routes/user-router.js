const express = require('express')
const router = express.Router()
const user = require('../controller/user-controller')

router.get('/',user.getAllUser);
router.get('/:id',user.getUser);
router.post('/register', user.addUser);
router.put('/editUser/:id',user.updateUser);
router.patch('/:id',user.updateUser);
router.delete('/:id',user.deleteUser);

module.exports = router