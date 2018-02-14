/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var passport = require ('passport');


module.exports = {

    signin: function (req,res)
    {
        User.findOne({"username":req.param("username")}).then(function(foundUser,err){
            if(foundUser){
                delete foundUser.password;
                delete foundUser.createdAt;
                delete foundUser.updatedAt;
                var expDate = new Date();
                expDate.setDate(expDate.getDate() + 2);
                token = SecurityService.createToken(foundUser);
                res.cookie("access_token", token, { httpOnly: false, expires: expDate });
                return res.ok (
                    {
                        token : token,
                        foundUser:foundUser
                    }
                );
            }
            else{
                return res.unauthorized();
            }
            
        })
    },
    signup : function (req,res) {
        User
            .create(SecurityService.hashPassword(_.omit(req.allParams(),'id')))
            .then(function(user){
                expDate=new Date();
                expDate.setDate(expDate.getDate() + 2);
                token = SecurityService.createToken(user);
                res.cookie("access_token",token,{httpOnly:false,expires:expDate})
                return {
                    user: user,
                    token: token
                };

            })
            .then(res.created)
            .catch(res.serverError)
    },
	signout : function (req, res) {
		res.cookie("access_token", "", { httpOnly: false, expires: new Date(0) })
	}
};