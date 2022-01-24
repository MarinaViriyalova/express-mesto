const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
    NODE_ENV,
    JWT_SECRET,
} = process.env;

module.exports.createUser = (req, res, next) => {
    const {
        name,
        about,
        avatar,
        email,
        password,
    } = req.body;

    bcrypt.hash(password, 10)
        .then((hash) => User.create({
            name,
            about,
            avatar,
            email,
            password: hash,
        }))
        .then(() => res.send({
            data: {
                name,
                about,
                avatar,
                email,
            },
        }))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                const e = new Error('Некорректные данные при создании карточек');
                e.statusCode = 400;
                next(e);
            } else if (err.code === 11000) {
                const e = new Error('Пользователь уже зарегистрирован');
                e.statusCode = 409;
                next(e);
            } else {
                const e = new Error('Произошла ошибка');
                e.statusCode = 500;
                next(e);
            }
        });
};

module.exports.getUsers = (req, res, next) => {
    User.find({})
        .then((user) => res.send({
            data: user,
        }))
        .catch((err) => {
            const e = new Error(err.message);
            e.statusCode = 404;
            next(e);
        });
};

module.exports.getUserById = (req, res, next) => {
    User.findById(req.params.userid)
        .orFail(() => {
            const e = new Error('Запись не найдена');
            e.statusCode = 404;
            next(e);
        })
        .then((user) => {
            res.send({
                data: user,
            });
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                const e = new Error('Нет пользователя с таким _id');
                e.statusCode = 400;
                next(e);
            } else {
                const e = new Error('Произошла ошибка');
                e.statusCode = 500;
                next(e);
            }
        });
};

module.exports.getUserProfile = (req, res, next) => {
    User.findById(req.user._id)
        .orFail(() => {
            const e = new Error('Запись не найдена');
            e.statusCode = 404;
            next(e);
        })
        .then((user) => {
            res.send({
                data: user,
            });
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                const e = new Error('Нет пользователя с таким _id');
                e.statusCode = 400;
                next(e);
            } else {
                const e = new Error('Произошла ошибка');
                e.statusCode = 500;
                next(e);
            }
        });
};

module.exports.updateAvatar = (req, res, next) => {
    const {
        avatar,
    } = req.body;

    User.findByIdAndUpdate(req.user._id, {
            avatar,
        }, {
            new: true,
            runValidators: true,
        })
        .then((avatarLink) => {
            res.send({
                data: avatarLink,
            });
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                const e = new Error(err);
                e.statusCode = 400;
                next(e);
            } else {
                const e = new Error('Произошла ошибка');
                e.statusCode = 500;
                next(e);
            }
        });
};

module.exports.updateUserProfile = (req, res, next) => {
    const {
        name,
        about,
    } = req.body;
    User.findByIdAndUpdate(req.user._id, {
            name,
            about,
        }, {
            new: true,
            runValidators: true,
        })
        .then((data) => {
            res.send({
                data,
            });
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                const e = new Error('Некорректные данные');
                e.statusCode = 400;
                next(e);
            } else {
                const e = new Error('Произошла ошибка');
                e.statusCode = 500;
                next(e);
            }
        });
};

module.exports.login = (req, res, next) => {
    const {
        email,
        password,
    } = req.body;
    User.findOne({
            email,
        }).select('+password')
        .then((user) => {
            if (!user) {
                return Promise.reject(new Error('Неправильные почта или пароль'));
            }
            req.user = user;

            return bcrypt.compare(password, user.password);
        })
        .then((matched) => {
            if (!matched) {
                return Promise.reject(new Error('Неправильные почта или пароль'));
            }
            const token = jwt.sign({
                _id: req.user._id,
            }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
            res.cookie('jwt', token, {
                    maxAge: 7 * 24 * 60 * 60,
                    httpOnly: true,
                })
                .end();


        })
        .catch((err) => {
            const e = new Error(err.message);
            e.statusCode = 500;

            next(e);
        });
};