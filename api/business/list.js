'use strict';

const AV = require('leancloud-storage');
const conf = require('../../config/config.js');

const APP_ID = conf.leancloud.APP_ID;
const APP_KEY = conf.leancloud.APP_KEY;
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

module.exports = async (ctx) => {
	var query = new AV.Query('Business')

	await query.find().then(function (results) {
		ctx.body = results;
	});
}
