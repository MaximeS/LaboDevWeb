/**
 * SubscriptionController
 *
 * @description :: Server-side logic for managing subscriptions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
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
             if(user)
             {
                 Subscription.find({owner:user.id})
                 .exec(function(err,subscriptionList){
                     var ctr=0;
                     if(subscriptionList){
                         subscriptionList.forEach(subscription => {
                             delete subscription.owner;
                             User.findOne({id:subscription.subscription})
                             .exec(function(err,user){
                                 if (user)
                                 {
                                     subscription.subscription=user;
                                 }
                                 else if(err){
                                     subscription.subscription="User deleted";
                                 }
                                 else
                                 {
                                     subscription.subscription="";
                                 }
                                 ctr++;
                                 if(ctr=== subscriptionList.length)
                                 {
                                    return res.json(200,subscriptionList);
                                 }
                             })
                         })
                        
                     }
                     else{
                        return res.json(200,{subscriptionList: "No subscription"});
                     }
                 });
             }
             else {
                  return res.json(403,{message: "Error User not found"})
             }
            
         }) 
      },
      /**
       * Subscribe to someone by pressing a button
       */
      subscribeToSomeone: function(req,res){
          User.findOne({id: req.user.id})
          .exec(function(err,user){
              if(user){
                return User.findOne({"username": req.param('subscriptionUsername')})
                .exec(function(err,seconduser){
                        if(seconduser){
                            Subscription.findOrCreate({owner: user.id,subscription: seconduser.id},{owner: user.id,subscription: seconduser.id})
                            .then(function(){
                                return res.json(200,{message:"You've been successfully subscribed to "+ req.param('subscriptionUsername')});
                            });
                        }
                        else{
                            return res.json(403,{message:"Cannot find user "+ req.param('subscriptionUsername')});
                        }
                    })
                }
              return res.json(404,"Error cannot find your own id");
             })
      },
      /**
       * Delete a subscription to someone.
       */
      deleteASubscription: function(req,res){
        User.findOne({username:req.param("username")},function(err,user){
            if(user){
                return Subscription.findOne({owner:req.user.id,subscription:user.id},function(err,subscription){
                    if(subscription)
                    {
                        return Subscription.destroy({id:subscription.id},function(err,deleted){
                            if(deleted)
                            {
                                return res.json(200,{message:"deleted"})
                            }
                            return res.json(401,{message:"not deleted"})
                        })
                        return res.json(404,{message:"subscription not found"})
                    }
                })
            }
            return res.json(404,{message:"User not found"})
        })
    },

    checkSubscription:function(req,res){
        User.findOne({username:req.param("username")},function(err,user){
            if(user){
                if(user.id!=req.user.id){
                    return Subscription.findOne({owner:req.user.id,subscription:user.id},function(err,subscription){
                        if(subscription){
                            return res.json(200,{subscribed:"subscribed"})
                        }
                        return res.json(200,{subscribed:"notsubscribed"})
                    })
                }
               return res.json(200,{subscribed:"you"})
            }
            return res.json(404,{message:"not found"})
        })
    }
};

