'use strict';

const
	conf = require('../ac-config.js'),
	db = require('../db.js');

module.exports = function *() {
  let widgetId = this.params.wid;
  console.log(widgetId)
  // let tagName = this.

  // db.Widget.update({uuid:uuid}, {$inc:{pullTimes:1}}, function(err, results) {
  //   if(err) throw err;
  // });
}