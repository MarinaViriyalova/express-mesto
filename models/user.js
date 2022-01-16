const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля - 2 символа.'],
    maxlength: [30, 'Максимальная длина поля - 30 символов.'],
    required: true,
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля - 2 символа.'],
    maxlength: [30, 'Максимальная длина поля - 30 символов.'],
  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
