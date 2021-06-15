import mongoose from "mongoose";

const Schema = mongoose.Schema;

const developerSchema = new Schema({
	id: {
		type: String,
		index: true,
		trim: true,
		required: true,
		maxlength: 36,
	},
	active: {
		// TRUE = Enable, FALSE = Disable
		type: Boolean,
		default: true,
		required: true,
	},
	fullname: {
		type: String,
		unique: true,
		required: [true, "Fullname is require"],
	},
	assetsId: {
		type: Object,
		default: [],
	},
	licensesId: {
		type: Object,
		default: [],
	},
});

const Developers = mongoose.model("Developers", developerSchema);
export default Developers;
