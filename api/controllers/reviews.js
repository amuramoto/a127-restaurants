var request = require('request');

module.exports = {
	getReviews: getReviews,
	postReview: postReview
}

function getReviews (req, res) {
	var id = req.swagger.params.id.value;
	request('http://api.usergrid.com/alexm/sandbox/reviews?ql=restID=' + id, function (error, response, body) {
		if (error) {
			res.send(error);
		} else {
			res.send(body)
		}
	});
}

function postReview (req, res) {
	request.post('http://api.usergrid.com/alexm/sandbox/reviews', {form: JSON.stringify(req.body)} , function (error, response, body) {
		if (error) {
			res.send(error);
		} else {
			res.send(body)
		}
	});
}