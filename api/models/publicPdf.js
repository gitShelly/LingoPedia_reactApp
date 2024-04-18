const mongoose = require("mongoose");
const { Schema } = mongoose;

const PublicSchema = new Schema({
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

const PublicModel = mongoose.model("PublicPdf", PublicSchema);
module.exports = PublicModel;