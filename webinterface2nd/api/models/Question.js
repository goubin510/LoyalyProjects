/**
 * Question.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 module.exports = {

 	attributes: {

 		question: {
 			type: 'string',
 			required: true,
 			unique: true
 		},

 		idd: {
 			type: 'int',
 			unique: true,
 			required: true
 		},

 		answers: {
      		collection: 'answer',
      		via: 'questionFrom'
    }

 	}
 };