/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	createUser:function(req,res){
        User.create(_.omit(req.allParams(),'id')).then(function(user){
            User.findOne({username: req.param('username')})
            .exec(function(err,user){
                if(user)
                {
                    return res.json(200,{message: "User successfully created"});
                }
                return res.json(403,{message: "User creation failed"});
            })
        });
        // console.log(req.param('username'));
        
    }
};

