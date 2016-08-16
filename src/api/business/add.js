'use strict';

const AV = require('leancloud-storage');
const conf = require('../../ac-config.js');

const APP_ID = conf.leancloud.APP_ID;
const APP_KEY = conf.leancloud.APP_KEY;
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

module.exports = async (name) => {
	var query = new AV.Query('Business');
	var Business = AV.Object.extend('Business');
	var bus = new Business();
	return new Promise(function(resolve, reject) {

		// 查重，Leancloud难道就不能自己做个 unique 限制!!
		query.equalTo('name', name);
		query.find().then(function (results) {
      if(results.length>0) {
      	reject(new Error('cannot add unique'));
      }
  	}, function (err) {
  		reject(err);
  	});
		
		bus.save({
			name: name
		}).then(function(b) {
			resolve(b);
		}).catch(function(err) {
			reject(err);
		});
		
	});
}