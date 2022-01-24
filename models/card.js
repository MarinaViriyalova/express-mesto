const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [2, 'Минимальная длина поля - 2 символа'],
        maxlength: [30, 'Максимальная длина поля - 30 символов'],
    },
    link: {
        type: String,
        required: [true, 'Поле должно быть заполнено'],
        validate: {
            validator: (v) => validator.isURL(v),
        },
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    likes: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            default: [],
        }],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('card', cardSchema);