const router = require('express').Router();
const validator = require('validator');

const {
    celebrate,
    Joi,
} = require('celebrate');

const {
    getUsers,
    getUserById,
    updateAvatar,
    updateUserProfile,
    getUserProfile,
} = require('../controllers/users');

const validateURL = (value) => {
    if (!validator.isURL(value, {
            require_protocol: true,
        })) {
        throw new Error('Пользователь использует некорректную ссылку');
    }
    return value;
};
router.get('/', getUsers);
router.get('/me', getUserProfile);
router.get('/:userid', celebrate({
    params: Joi.object().keys({
        userid: Joi.string().length(24).hex(),
    }),
}), getUserById);
router.patch('/me', celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(15),
        about: Joi.string().required().max(30),
    }),
}), updateUserProfile);
router.patch('/me/avatar', celebrate({
    body: Joi.object().keys({
        avatar: Joi.string().custom(validateURL).required(),
    }),
}), updateAvatar);

module.exports = router;