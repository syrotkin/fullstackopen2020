const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 1
    },
    favoriteGenre: {
        type: String,
        required: true,
        minlength: 1
    }
});

module.exports = mongoose.model('User', schema);