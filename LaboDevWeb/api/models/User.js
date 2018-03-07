/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,
  attributes: {
    username:{
      type:'string',
      required:true,
    },
    nickname:{
      type:'string',
      defaultsTo:""
    },
    password:{
      type:'string',
      required:true,
    },
    firstName:{
      type:'string',
      defaultsTo:""
    },
    lastName:{
      type:'string',
      defaultsTo:""
    },
    rank:{
      type:'int',
      defaultsTo:1
    },
    messages:{
      collection:'message',
      via:'owner'
    },
    toJSON: function () {
      var obj = this.toObject();
      // delete obj.password;
      delete obj.createdAt;
      delete obj.updatedAt;
      return obj;
  }

  }
};

