const express = require('express');
const bodyParser = require('body-parser');
const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    req.user = {
        _id: '61e4233211825796fe07dea9',
    };

    next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.use((req, res) => {
    res.status(404).send({ message: 'Ресурс не найден' });
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
    useUnifiedTopology: true,
    useNewUrlParser: true,

});

app.listen(PORT, () => {
    console.log(`Ссылка на сервер: http://localhost:${PORT}`);
});