/**
* ProductController
*
* @description :: Server-side logic for managing products
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/

module.exports = {

	new: function(req, res) {
		res.view();
	},

	create: function(req, res, next){
		Product.create( req.params.all(), function productCreated (err, product){
		});
		res.redirect('/product/show/' + product.id);
	},

	show: function(req, res, next) {
		Product.findOne(req.param('id'), function foundProduct(err, product) {
			if (err) return next(err);
			if (!product) return next();
			res.view({
				product: product
			});
		});
	},


};

