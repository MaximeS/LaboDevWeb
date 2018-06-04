/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	createUser:function(user){
        User.create(_.omit(req.allParams(),'id')).then(function(user){
            User.findOne({username: req.param('username')})
            .exec(function(err,user){
                if(user)
                {
                    return res.json(201,{message: "User successfully created"});
                }
                return res.json(403,{message: "User creation failed"});
            })
        });
        
    },
    findUsers:function(req,res){
        if(req.param("userPartial")!="")
        {
            User.find({username:{'contains':req.param('userPartial')}},function(err,users){
                if(users)
                {
                    return res.json(200,{users:users})
                }
                return res.json(404,{message:"Not any user found"})
            })
        }
        else
        {
            return res.json(404,{message:"User empty"})
        }
    },
    me:function(req,res){
        console.log(req.user)
        if(req.user){
            User.findOne({id:req.user.id},function(err,user){
                if(user)
                {
                    delete user.id
                    delete user.password
                    return res.json(200,{user:user})
                }
                return res.json(404,{message:"User not found"})
            })
        }
        else{
            return res.json(204,{message:"Not connected"})
        }
    },
    getUser:function(req,res){
        User.findOne({username:req.param('username')},function(err,user){
            if(user)
            {
                return res.json(200,{user:user})
            }
            return res.json(404,{message:"User not found"})
        })
    },
    updateProfile:function(req,res){
        // User.findOne({id:req.user.id},function(err,user){
        //     if(user)
        //     {
                
        //     }
        // })
    }
};

