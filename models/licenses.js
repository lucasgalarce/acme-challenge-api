import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const licenseSchema = new Schema({
    id: {
        type      : String,
        index     : true,
		trim      : true,
		required  : true,
        maxlength : 36
    },
    software: {
        type: String,
        required: [true, 'Software is require']
    },
});

const Licenses = mongoose.model('Licenses', licenseSchema);
export default Licenses;
