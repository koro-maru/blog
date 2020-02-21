var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

const CommentSchema = new Schema({
    text: {type: String, required: true},
    dateCreated: {type: Date, required: true},
    parent: {type: ObjectId}
}) 

CommentSchema.virtual('dateCreatedFormatted').get
    (function(){
        return moment(this.dateCreated).format('MMMM Do, YYYY')
    })

module.exports = mongoose.model("Comment", CommentSchema);