/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	grantPermission: function(req,res){
        return res.ok(
            User.findOne({id: req.param('id')})
            .exec(function(err,user){
               if(err)
               {
                   console.log("Error on finding user id "+ req.param('id'));
                   return res.json(403,{message :"Error User not Found"});
               } 
               return user.update({id: req.param('id')},{rank: req.param('rank')})
               .exec(function(err,updated){
                   if(err)
                   {
                       console.log("Error on granting permission user id "+ req.param('id'));
                       return res.json(403,{message:"Error User hasn't been updated"});
                   }
                   console.log("Grant permission level "+ req.param('rank')+ " to user id "+ req.param('id'));
                   return res.json(200,{message: "User permission granted"});
               })
            })
        );
    }
};

