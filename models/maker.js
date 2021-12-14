const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const Schema = mongoose.Schema;

const MakerSchema = new Schema(
    {
        name: {type: String, require: true},
        established_year: {type: Number, required: true},
        logo: {type: String, require: true},
    }
);

MakerSchema.virtual('url').get(function() {
    return '/makers/' + this._id;
});

MakerSchema.virtual('pretty_date').get(function() {
    return DateTime.fromJSDate(this.esatblished_date).toISODate();
})

module.exports = mongoose.model('Maker', MakerSchema);