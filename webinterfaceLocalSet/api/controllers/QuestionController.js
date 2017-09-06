/**
 * QuestionController
 *
 * @description :: Server-side logic for managing questions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {

 	'new': function(req,res){
 		res.view();
 	},

 	create: function(req, res, next){
 		Question.create( req.params.all(), function questionCreated (err, question){
			if(err){
				console.log(err);
				res.redirect('/question/new');
			}

 			res.redirect('/question/new/'+ question.id);
 		});
 	},

	show: function(req, res, next){
		Question.findOne(req.param('id'), function foundQuestion (err, question) {
			if(err) return next(err);
			if(!question) return next();
			res.view({
				question: question
			});
		});
	}
 };