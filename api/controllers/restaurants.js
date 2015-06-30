var request = require('request');
var async = require('async');

module.exports = {
	getRestaurants: getRestaurants,
	getRestaurantById: getRestaurantById
}

function getRestaurants (req, res) {
	request('http://api.usergrid.com/alexm/sandbox/restaurants?ql=', function (error, response, body) {
		if (error) {
			res.send(error);
		} else {
			res.send(body)
		}
	})
};

function getRestaurantById (req, res) {
	var id = req.swagger.params.id.value;
	async.parallel({
		restaurant: function (callback) {
			request('http://api.usergrid.com/alexm/sandbox/restaurants?ql=restID=' + id, function (error, response, body) {
				if (error) {
          				callback(error);
				} else {
					callback(null, JSON.parse(body));
				}
			});
		},
		reviews: function (callback) {
			async.waterfall([
				function (callback) {
					request('http://127.0.0.1:10010/restaurants/' + id + '/reviews', function (error, response, body) {
						if (error) {
              						callback(error);
						} else {
							callback(null, JSON.parse(body));
						}
					});
				},
				function (reviews, callback) {
					var l = reviews.entities.length;
          var aggregate = 0;
          var i;
          for (i = 0; i < l; i++) {
              aggregate += reviews.entities[i].rating;
          }
          aggregate = {
              aggregate: +(aggregate / i).toFixed(2)
          };
          callback(null, reviews, aggregate);
				}
			], callback);
		}
	},
	function (err, result) {
    if (err) { return res.send(result); }
		res.send(result);
	})
};
