const mongoose = require("mongoose");
const { Schema } = mongoose;

const PrivateSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    lang: {
        type: Number,
        required: true
    },
    pdf: {
        type: Buffer,
        required: true
    }
});

const PrivateModel = mongoose.model("PrivatePdf", PrivateSchema);
module.exports = PrivateModel;
