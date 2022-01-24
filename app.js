const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const validator = require('validator');
const { errors, celebrate, Joi } = require('celebrate');

const { login, createUser } = require('./controllers/users');

const auth = require('./middlewares/auth');

const {
    PORT = 3000,
} = process.env;

const app = express();

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
}, (err, next) => {
    if (err) {
        const e = new Error(err.message);
        e.statusCode = err.code;
        next(e);
    } else {
        console.warn('Connected to mestodb');
    }
});

app.post('/signin', celebrate({
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),
}), login);

const validateURL = (value) => {
    if (!validator.isURL(value, {
            require_protocol: true,
        })) {
        throw new Error('Пользователь использует некорректную ссылку');
    }
    return value;
};

app.post('/signup', celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30),
        about: Joi.string().min(2).max(30),
        avatar: Joi.string().custom(validateURL),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(8),
    }),
}), createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res, next) => {
    const e = new Error('Страница не найдена');
    e.statusCode = 404;
    next(e);
});

app.use(errors());
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    const message = statusCode === 500 ? 'Server error' : err.message;
    res.status(statusCode).send({
        message,
    });

    next();
});

app.listen(PORT, () => {
    console.error(`Listening on port ${PORT}`);
});