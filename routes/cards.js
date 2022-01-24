const router = require('express').Router();
const validator = require('validator');

const {
    celebrate,
    Joi,
} = require('celebrate');

const {
    createCard,
    getCards,
    delCardByid,
    likeCard,
    dislikeCard,
} = require('../controllers/cards');

const validateURL = (value) => {
    if (!validator.isURL(value, {
            require_protocol: true,
        })) {
        throw new Error('Пользователь использует некорректную ссылку');
    }
    return value;
};

router.post(
    '/',
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required().min(2).max(30),
            link: Joi.string().custom(validateURL).required(),
        }),
    }),
    createCard,
);
router.get('/', getCards);
router.delete('/:cardId', celebrate({
    params: Joi.object().keys({
        cardId: Joi.string().length(24).hex(),
    }),
}), delCardByid);
router.put('/:cardId/likes', celebrate({
    params: Joi.object().keys({
        cardId: Joi.string().length(24).hex(),
    }),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
    params: Joi.object().keys({
        cardId: Joi.string().length(24).hex(),
    }),
}), dislikeCard);

module.exports = router;