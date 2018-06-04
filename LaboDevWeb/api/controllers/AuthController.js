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
        console.log(req.allParams())
        User.findOne({"username":req.param("username")}).then(function(foundUser,err){
            if(foundUser && SecurityService.comparePassword(req.param("password"),foundUser))
            {
                delete foundUser.createdAt;
                delete foundUser.updatedAt;
                var expDate = new Date();
                expDate.setDate(expDate.getDate() + 2);
                token = SecurityService.createToken(foundUser);
                res.cookie("access_token", token, { httpOnly: true, expires: expDate });
                console.log(token);
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
                res.cookie("access_token",token,{httpOnly:true,expires:expDate})
                return {
                    user: user,
                    token: token
                };

            })
            .then(res.created)
            .catch(res.serverError)
    },
	signout : function (req, res) {
        res.cookie("access_token", "", { httpOnly: true, expires: new Date(0) });
        return res.json(200,{message:"disconnected"})
    },
    checkCookie: function(req,res){
        if(req.user){
            User.findOne({"username":req.user.username}).then(function(foundUser,err){
                if(foundUser){
                    if(SecurityService.comparePassword(req.user.password,foundUser))
                    {
                        console.log("found");
                        delete foundUser.createdAt;
                        delete foundUser.updatedAt;
                        var expDate = new Date();
                        expDate.setDate(expDate.getDate() + 2);
                        token = SecurityService.createToken(foundUser);
                        res.cookie("access_token", token, { httpOnly: true, expires: expDate });
                        return res.ok (
                            {
                                token : token,
                                foundUser:foundUser
                            }
                        );
                    }
                    else
                    {
                        res.cookie("access_token","",{httpOnly:true,expires: new Date(0)})
                    }
                }
                else
                {
                    res.cookie("access_token","",{httpOnly:true,expires: new Date(0)})
                }
            })
        }
        else{
            return res.ok();
        }
    }
};
