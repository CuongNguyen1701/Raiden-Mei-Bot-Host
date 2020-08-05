const mongoose = require('mongoose');
mongoose.set('debug', true);

const dataSchema = mongoose.Schema({
    id: Number,
    guessDisabled: Boolean
})

module.exports = mongoose.model('cooldowns', dataSchema);