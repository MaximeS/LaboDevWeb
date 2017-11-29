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

