const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
     title: {type: String, required: true},
     body: {type: Buffer, required: true},
     author: {type: ObjectId, required: true},
     dateCreated: {type: String, required: true}
})

PostSchema.virtual('dateCreatedFormatted').get
    (function(){
        return moment(this.dateCreated).format('MMMM Do, YYYY')
    })

module.exports = mongoose.model("Post", PostSchema)
