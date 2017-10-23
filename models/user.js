const mongoose = require('mongoose'); //ORM for MongoDB
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define our model 
const userSchema=new Schema({
	email:{ type:String, unique: true, lowercase:true },
	password:String,
	full_name:String
});

//ON save Hook encrypt password
//before saving a model run this
userSchema.pre('save',(next)=>{
	//The contect is the model
	const user = this;

	//generate a salt this tales time thats why the callback
	bcrypt.genSalt(10,(err,salt)=>{
		if(err) return next(err);
		

		// then we encrypt using the salt this takes time and as callback
		bcrypt.hash(user.password,salt,null,(err,hash)=>{
			if(err) return next(err);
				// override current password with encrypted version
				user.password=hash;
				//Continue saving process
				next();
		})
	})
});

// Create the model Class
const ModelClass = mongoose.model('user',userSchema);


// Export the model
module.exports=ModelClass;