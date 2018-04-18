/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    addMessage: function (req, res) {
        Message
            .create({ owner: req.user.id, fullMessage: req.param('fullMessage') })
            .exec(function (err, message) {
                if (err) {
                    return res.json(500, { message: "Error while creating message" });
                }
                else {
                    return res.json(201, message);
                }
            })
    },
    getTimelineMessage: function (req, res) {
        var allMessages = [];
        return Subscription
            .find({ owner: req.user.id })
            .exec(function (err, subscriptions) {
                if (err) {
                    console.log(err)
                    return res.json(200, { followedtots: "No subscription before checking your followed foes tots" })
                }
                var ctr = 0
                return subscriptions.forEach(subscription => {
                    Message
                        .find({ owner: subscription.subscription })
                        .exec(function (err, messages) {
                            if (err) {
                                return res.json(200, { followedtots: "No tots on your subscriptions" })
                            }
                            messages.map(x => allMessages.push(x))
                            if (ctr === (subscriptions.length - 1)) {
                                Message.find({ owner: req.user.id })
                                    .exec(function (err, myMessages) {
                                        myMessages.map(x => allMessages.push(x))
                                        allMessages.sort(function (a, b) {
                                            return new Date(b.createdAt) - new Date(a.createdAt);
                                        })

                                        return res.json(200, { followedtots: allMessages });
                                    })
                            }
                        })
                })
                ctr++;

            });

    },
    deleteMessage: function (req, res) {

    },
    getUserMessages: function(req,res){
        User.findOne({username:req.param('username')},function(err,user){
            if(user)
            {
                return Message.find({owner: user.id},function(err,messages){
                    if(messages)
                    {
                        return res.json(200,{messages:messages})
                    }
                    return res.json(404,{message:"No messages for this user"})
                })
            }
            return res.json(404,{message:"User not found"})
        })
    }
};

