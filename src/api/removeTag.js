'use strict';

const conf = require('../ac-config.js');
const mongoose = require('mongoose');
	// db = require('../db.js');

module.exports = async ctx => {
  let widgetId = mongoose.Types.ObjectId( ctx.req.body.wid );
  let tagId = mongoose.Types.ObjectId( ctx.req.body.tagid );

  if(!widgetId || !tagId) { ctx.status = 404; }

  try {
	  // Remove tag from widget's tags
	  let w = await db.Widget
	  	.findById(widgetId)
	  	.populate('tags')
	  	.exec();

	  w.tags.pull({ _id: tagId });
	  await w.save();

	  ctx.status = 200;
	} catch(err) {
		ctx.status = 404;
	}
}