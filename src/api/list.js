'use strict';

const
	db = require('../db.js');

module.exports = function *() {
  	let that = this;
  	yield new Promise(resolve => {
  	  	db.Widget.find({}, function (err, docs) {
  	  	  	that.body = docs;
  	  	  	resolve();
  	  	});
  	});
}