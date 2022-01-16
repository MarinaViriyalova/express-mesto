const router = require('express').Router();

const {
    getUsers,
    getUser,
    createUser,
    updateUserAvatar,
    updateUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:_id', getUser);
router.post('/', createUser);
router.patch('/me/avatar', updateUserAvatar);
router.patch('/me', updateUser);

module.exports = router;