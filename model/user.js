var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
userName: {
type: String,
required: true,
},
createdAt: { type: Date, default: Date.now },

email: {
type: String,
required: true,
},
age: {
type: String,
required: true,
},
password: {
type: String,
required: true},
role: {
type: String,
enum: ['user', 'admin'], 
default: 'user' 
},
status: {
    type: String,
    enum: ['active', 'banned'], 
    default: 'active', 
  }
},
);
module.exports=mongoose.model('user',userSchema)