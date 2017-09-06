/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	page: function(req, res){
		res.view();
	},
	
	create: function(req, res, next){
		Chat.create( req.params.all(), function chatCreated (err, chat){
			res.redirect('/chat/page');
		});
  	},

  	answer: function(req, res, next){
		Chat.create( req.params.all(), function chatAnswered (err, chat){
			res.redirect('/backchat');
		});
  	},

};

