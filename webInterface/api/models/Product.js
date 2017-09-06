/**
 * Produit.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

	name: {
		type: 'string', 
	 	required: true, 
	 	unique: true 
	},

// 	superCategory: { 
// 		type: 'string' 
// 	},

// 	mainCategory: { 
// 		type: 'string' 
// 	},
//    
// 	subCategory: { 
// 		type: 'string' 
// 	},

// 	description: { 
// 		type: 'string' 
// 	},

// 	price: { 
// 		type: 'int' 
// 	},
//    	
// 	detDesc: { 
// 		type: 'string' 
// 	},

//    	image: { 
// 		type: 'string' 
// 	},
//    	
// 	url: { 
// 		type: 'string' 
// 	},

// -----------------------------------

  	// colors: {
  	// 	collection: 'color',
  	// 	via: 'productColor'
  	// },

  	// tags: {
  	// 	collection: 'tag',
  	// 	via: 'productTag'
  	// },

  	// relateds: {
  	// 	collection: 'related',
  	// 	via: 'productRelated'
  	// }
  }
};