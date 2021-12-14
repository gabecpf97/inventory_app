const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CarSchema = new Schema(
    {
        name: {type: String, required: true},
        maker: {type: Schema.Types.ObjectId, ref: 'Maker', required:true},
        type: {type: Schema.Types.ObjectId, ref: 'Type', required:true},
        price: {type: Number, required: true},
        picture: {type: String, required:true},
        description: {type: String, required: true},
        release_year: {type: Number, required:true},
        number_in_stock: {type: Number, required: true}
    }
);

CarSchema.virtual('url').get(function() {
    return '/cars/' + this._id;
});

module.exports = mongoose.model('Car', CarSchema);