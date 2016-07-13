'use strict';

const
	db = require('../db.js');

module.exports = async (ctx, next) => {
	let that = ctx;
	await db.Widget.find({}, function (err, docs) {
	  that.body = docs;
	});
}