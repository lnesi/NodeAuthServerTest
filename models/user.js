const mongoose = require('mongoose'); //ORM for MongoDB
const Schema = mongoose.Schema;

// Define our model 
const userSchema=new Schema({
	email:{ type:String, unique: true, lowercase:true },
	password:String,
	full_name:String
});

// Create the model Class
const ModelClass = mongoose.model('user',userSchema);


// Export the model
module.exports=ModelClass;