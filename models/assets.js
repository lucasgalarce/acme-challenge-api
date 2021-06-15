import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const assetSchema = new Schema({
    id: {
        type      : String,
        index     : true,
		trim      : true,
		required  : true,
        maxlength : 36
    },
    brand: {
        type: String,
        required: [true, 'Brand is require']
    },
    model: {
        type: String,
        required: [true, 'Model is require']
    },
    type: {
        type: String,
        enum: ['laptop', 'keyboard', 'mouse', 'headset', 'Monitor'],
        required: [true, 'Model is require']
    }
});

const Assets = mongoose.model('Assets', assetSchema);
export default Assets;