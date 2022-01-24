const validator = require('validator');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [2, 'Минимальная длина поля - 2 символа'],
        maxlength: [30, 'Максимальная длина поля - 30 символов'],
        default: 'Жак-Ив Кусто',
    },
    about: {
        type: String,
        minlength: [2, 'Минимальная длина поля - 2 символа'],
        maxlength: [30, 'Максимальная длина поля - 30 символов'],
        default: 'Исследователь',
    },
    avatar: {
        type: String,
        default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
        validate: {
            validator: (v) => validator.isURL(v),
        },
    },
    email: {
        type: String,
        required: [true, 'Поле должно быть заполнено'],
        unique: true,
        sparse: true,
        validate: validator.isEmail,
    },
    password: {
        type: String,
        required: [true, 'Поле должно быть заполнено'],
        validate: validator.isStrongPassword,
        select: false,
    },
});

module.exports = mongoose.model('user', userSchema);