const Card = require('../models/card');

const getCards = (req, res) => {
    const { cardsList } = {};
    return Card.find(cardsList)
        .then((card) => res.status(200).send(card))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                res.status(400).send({ message: 'Некорректные данные при получении карточек.' });
            } else {
                res.status(500).send({ message: 'Произошла ошибка' });
            }
        });
};

const createCard = (req, res) => {
    const { name, link } = req.body;
    return Card.create({ name, link, owner: req.user._id })
        .then((card) => res.status(200).send(card))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                res.status(400).send({ message: 'Некорректные данные при создании карточки.' });
            } else {
                res.status(500).send({ message: 'Произошла ошибка' });
            }
        });
};

const likeCard = (req, res) => {
    Card.findByIdAndUpdate(
            req.params.id, { $addToSet: { likes: req.user._id } }, { new: true },
        )
        .orFail(() => { throw new Error('Не возможно поставить like - ошибка 404'); })
        .then((card) => res.status(200).send(card))
        .catch((err) => {
            if (err.message === 'Не возможно поставить лайк - ошибка 404') {
                res.status(404).send({ message: 'Не возможно поставить like - ошибка 404' });
            } else if (err.name === 'CastError') {
                res.status(400).send({ message: 'Не возможно поставить like - ошибка 400' });
            } else {
                res.status(500).send({ message: 'Произошла ошибка сервера' });
            }
        });
};

const deleteCard = (req, res) => {
    Card.findByIdAndRemove(req.params.id)
        .orFail(() => { throw new Error('Не возможно удалить карточку'); })
        .then((card) => res.status(200).send(card))
        .catch((err) => {
            if (err.message === 'Не возможно удалить карточку - ошибка 404') {
                res.status(404).send({ message: 'Не возможно удалить карточку - ошибка 404' });
            } else if (err.name === 'CastError') {
                res.status(400).send({ message: 'Не возможно удалить карточку - ошибка 400' });
            } else {
                res.status(500).send({ message: 'Произошла ошибка сервера' });
            }
        });
};

const dislikeCard = (req, res) => {
    Card.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, { new: true })
        .orFail(() => { throw new Error('Не возможно удалить like'); })
        .then((card) => res.status(200).send(card))
        .catch((err) => {
            if (err.message === 'Не возможно удалить лайк - ошибка 404') {
                res.status(404).send({ message: 'Не возможно удалить like - ошибка 404' });
            } else if (err.name === 'CastError') {
                res.status(400).send({ message: 'Не возможно удалить like - ошибка 400' });
            } else {
                res.status(500).send({ message: 'Произошла ошибка сервера' });
            }
        });
};

module.exports = {
    getCards,
    createCard,
    likeCard,
    deleteCard,
    dislikeCard,
};