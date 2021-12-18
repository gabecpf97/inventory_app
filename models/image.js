const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImgSchema = new Schema(
    {
        data: {type: Buffer, required: true},
        content_type: {type: String, required: true}
    }
);

module.exports = mongoose.model('Image', ImgSchema);