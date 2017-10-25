const User = require ('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user){
	// We pass anobject with a key of sub. and has convention jwt has a sub property that
	//especified the subject of what this token belongs to also we need to pass iat which menas
	// issue at time

	const timestam= new Date().getTime();
	return jwt.encode({ sub:user.id,iat:timestam }, config.secret);
}

exports.signup = function(req,res,next){
	const {email,password,full_name}= req.body;
	if(!email || !password || !full_name){
		//we can validate more on this fields.
		return res.status(422).send({error:"You mus provided email, password and full_name"});
	}
	// See if the user with the given email exist 
	User.findOne({email},function(err,existingUser){
		if(err) return next(err);
		//if user exist return an error
		if(existingUser){
			return res.status(422).send({error:'Email is already registerd'});
		}
		//if user does not exist insert into db 
		const user=new User({email,password,full_name});
		user.save(function(err){
			if(err) return next(err);
			// We need to produce a token and return this for future request. JSON Web Token or JWT
			return res.json({token:tokenForUser(user)})
		});
	});


}

exports.signin = function(req,res,next){
	//User is already verified so we just need.to return a token
	// passport already pasing the user from the done function to the request.
	return res.json({token:tokenForUser(req.user)});

}