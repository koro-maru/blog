var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {type: String},
    profilePicture: {type: Buffer},
    firstName: {type: String},
    lastName: {type: String},
    username: {type: String, required: true},
    password: {type: String, required: true},
})

UserSchema.virtual('fullName').get
(function(){
    return this.firstName + " " + this.lastName;
});

module.exports = mongoose.model('User', UserSchema)