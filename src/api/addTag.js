'use strict';

const
	conf = require('../ac-config.js'),
	db = require('../db.js');

module.exports = async ctx => {
  let widgetId = ctx.req.body.wid;
  let tagName = ctx.req.body.tagname;

  if(!widgetId || !tagName) { ctx.status = 404; }

  try {
  	// Insert or Update
  	let newTag = await db.Tag.findOneAndUpdate({name:tagName}, {$setOnInsert: {name:tagName}}, {upsert: true, setDefaultsOnInsert: true, new:true});
		
	  // Push into widget's tags  |  { ok: 1, nModified: 0, n: 1 }
		let result = await db.Widget.update({_id:widgetId}, {$addToSet: {'tags': newTag}});
		
		if(result.nModified === 1) {
			ctx.status = 200;
		} else {
			ctx.status = 400;
			ctx.body = '已包含该标签';
		}
	} catch(err) {
		ctx.status = 404;
	}
}