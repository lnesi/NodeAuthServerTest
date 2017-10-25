const passport = require('passport');
const User = require("../models/user");
const config = require('../config');
const JwtStrategy= require('passport-jwt').Strategy;
const ExtractJwt= require('passport-jwt').ExtractJwt;
const LocalStrategy=require('passport-local');


//Create local stretegy to handle email and password login
const localOptions ={
	usernameField:'email'
}
const localLogin= new LocalStrategy(localOptions,function(email,password,done){
	// Veryfy details and call done with results
	User.findOne({email:email},function(err,user){
		if(err) return done(err,false);
		if(!user){
			return done(null,false);
		}else{
			//Compare passwords
			//we take the salt from the db hashed password and encrtpt the 
			//provided password to get a new hashed password then we compare the 2 hashes
			user.comparePassword(password,function(err,isMatch){
				if(err) return done(err);
				if(!isMatch){
					return done(null,false);
				}else{
					return done(null,user); 
				}
			});
			

		}
	})
});

//Setup options for JWT strategy for passport
const jwtOptions={
	// We need to tell the startegy where to find the token
	jwtFromRequest:ExtractJwt.fromHeader('authorization'),
	// We need to tell tp be able to decode the token
	secretOrKey:config.secret
}


//create JWT strategy params: options and callback when attent to login
const jwtLogin= new JwtStrategy(jwtOptions,function(payload,done){
	//payload is the decoded JWT token
	//We want to see if the user id in the paylod exist in the DB 
	// if so we call done with the user if not we call done without user
	// in the done function we pass first argument an error and second the result of the JWT validation
	User.findById(payload.sub,function(err,user){
		if(err) {return done(err,false)};
		
		if(user){
			return done(null,user);
		}else{
			return done(null,false);
		}


		
	});
});

// Tell passport to use JWT strategy
passport.use(jwtLogin);
passport.use(localLogin);
