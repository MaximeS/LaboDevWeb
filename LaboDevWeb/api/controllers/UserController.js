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
     * Can get subscription of an user by its id but will be used only by the user itself since none will have ids of others
     */
    getSubscriptionById: function(req,res){
       User.findOne({id: req.param('id')})
       .exec(function(err,user){
           if(user && user.subscriptionList!="")
           {
               return res.json(200,{subscriptionList: user.subscriptionList});
           }
           else if (user && user.subscriptionList==""){
                return res.json(200,{subscriptionList: "No subscription"});
           }
           return res.json(403,{message: "Error User not found"})
       }) 
    },
    /**
     * Can get subscription of an user by its username.
     */
    getSubscriptionByTagName: function(req,res){
        User.findOne({username: req.param('username')})
        .exec(function(err,user){
            if(user && user.subscriptionList!="")
            {
                return res.json(200,{subscriptionList: user.subscriptionList});
            }
            else if (user && user.subscriptionList==""){
                 return res.json(200,{subscriptionList: "No subscription"});
            }
            return res.json(403,{message: "Error User not found"})
        }) 
     },
     /**
      * Subscribe to someone by pressing a button
      */
     subscribeToSomeone: function(req,res){
         User.findOne({id: req.param('id')})
         .exec(function(err,user){
             if(user){
                 return User.findOne({username: req.param('subscriptionUsername')})
                 .exec(function(err,user){
                    if(user)
                    {
                        return User.update({id: req.param('id')},{subscriptionList: user.subscriptionList+req.param('subscriptionUsername')+","})
                        .exec(function(err,updated){
                            if(updated)
                            {
                                return res.json(200,{message:"You're now subscribed to "+ req.param('subscriptionUsername'+ ".")});
                            }
                            return res.json(403,{message: "Error cannot subscribe to "+ req.param('subscriptionUsername'+".")});
                        })
                    }
                 })
             }
             return res.json(403,"Error cannot find your own id")
         })
     },
     /**
      * Delete a subscription to someone.
      */
     deleteASubscription: function(req,res){
         User.findOne({id: req.param('id')})
         .exec(function(err,user){
             if(user){
                 return User.findOne({username: req.param('subscriptionUsername')})
                 .exec(function(err,user){
                     if(user){
                         User.update({id: req.param('id')},
                         {subscriptionList: substring(user.subscriptionList.indexOf(
                            req.param('subscriptionUsername')),user.subscriptionList.indexOf(req.param('subscriptionUsername')+
                            req.param('subscriptionUsername').length+1))})
                         .exec(function(err,updated){
                            if(updated)
                            {
                                return res.json(200,{message: "You're not subscribed to "+ req.param('subscriptionUsername') + " anymore."});
                            }    
                            return res.json(403,{message: "Error cannot cancel your subscription to "+ req.param('subscriptionUsername')});
                         })
                     }
                     return res.json(403,{message: "Error cannot find your subscription"});
                 })
                 return res.json(403,{message: "Error cannot find your own id"});
             }
         })
     }
};

