const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const Schema = mongoose.Schema;

const MakerSchema = new Schema(
    {
        name: {type: String, require: true},
        established_year: {type: Number, required: true},
        logo: {type: Schema.Types.ObjectId, ref: 'Image'},
    }
);

MakerSchema.virtual('url').get(function() {
    return '/maker/' + this._id;
});

MakerSchema.virtual('pretty_date').get(function() {
    return DateTime.fromJSDate(this.esatblished_date).toISODate();
})

module.exports = mongoose.model('Maker', MakerSchema);