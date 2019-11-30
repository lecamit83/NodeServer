const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    path : String,
});

const Images = mongoose.model('Images', imageSchema);
module.exports = Images;