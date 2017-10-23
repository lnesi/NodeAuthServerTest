const User = require ('../models/user');


exports.signup = function(req,res,next){
	const {email,password,full_name}= req.body;
	if(!email || !password || !full_name){
		//we can validate more on this fields.
		return res.status(422).send({error:"You mus provided email, password and full_name"});
	}
	// See if the user with the given email exist 
	User.findOne({email},(err,existingUser)=>{
		if(err) return next(err);
		//if user exist return an error
		if(existingUser){
			return res.status(422).send({error:'Email is already registerd'});
		}
		//if user does not exist insert into db 
		const user=new User({email,password,full_name});
		user.save((err)=>{
			if(err) return next(err);
			return res.json({success:true})
		});
	});


}