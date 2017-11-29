/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /**
     * Grant permission.
     * Permission levels:
     * 1 is the default permission level (simple user).
     * 2 is moderator (can delete posts/timeout user for a period of time)
     * 3 is super-admin (can do anything a moderator can do but can also ban/delete all posts of an user and the user itself)
     */
	grantPermission: function(req,res){
        // console.log("entered function grant Permission");
        User.findOne({id: req.param('id')})
        .exec(function(err,user){
            if(user)
            {
                return User.update({id: req.param('id')},{rank: req.param('rank')})
                .exec(function(err,updated){
                    if(updated)
                    {
                        console.log("Grant permission level "+ req.param('rank')+ " to user id "+ req.param('id'));
                        return res.json(200,{message: "User permission granted"});
                    }
                    console.log("Error on granting permission user id "+ req.param('id'));
                    return res.json(403,{message:"Error User hasn't been updated"});
                    
                });
                
            } 
            console.log("Error on finding user id "+ req.param('id'));
            return res.json(403,{message :"Error User not Found"});
            
        });
    },
    /**
     * Delete a user with all his messages
     */
    deleteAUser: function(req,res){
        User.findOne({username: req.param('username')})
        .exec(function(err,user){
            if(user){
                return Message.find({user: user.id})
                .exec(function(err,messages){
                    if(messages)
                    {
                        messages.forEach(message => {
                            Message.destroy(message.id)
                        });
                        return User.destroy({username: req.param('username')})
                        .exec(function(err,destroyed){
                            if(destroyed)
                            {
                                return res.json(200,"User "+ req.param('username')+" has been deleted.")
                            }
                            return res.json(403,"Cannot delete "+ req.param('username')+".");
                        })
                    }
                    else{
                        return User.destroy({username: req.param('username')})
                        .exec(function(err,destroyed){
                            if(destroyed)
                            {
                                return res.json(200,"User "+ req.param('username')+" has been deleted.")
                            }
                            return res.json(403,"Cannot delete "+ req.param('username')+".");
                        })
                    }
                   
                })
            }
            return res.json(403,"Cannot find user with "+req.param('username')+" as username.");
        })
    }
};

