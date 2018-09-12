var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var HeadlinesSchema = new Schema({
    articles: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    },
    summary: {
        type: String,
        required: true
    }
});

var Headline = mongoose.model("Headline", HeadlinesSchema);
module.exports = Headline;