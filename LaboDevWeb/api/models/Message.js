/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,
  attributes: {
    owner:{
      model:'User',
      required:true,
    },
    fullMessage:{
      type:'string',
      required:true,
    },
    publicationDate:{
      type:'Date',
      required:true,
    }
  }
};
