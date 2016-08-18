const
	mongoose = require('mongoose'),
	conf = require('./ac-config.js');

mongoose.connect(conf.mongodb.uri, conf.mongodb.options);
var Schema = mongoose.Schema;

var Widget = mongoose.model('Widget', new Schema({
  uuid: { type: String, unique: true },
  name: String,
  description: String,
  appId: String,
  moduleId: String,
  author: String,
  platform: String,
  pushDate: { type: Date, default: Date.now },
  pullTimes: { type: Number, default: 0 },

  tags: [{ type:Schema.Types.ObjectId, ref:'Tag' }]
}));

var Tag = mongoose.model('Tag', new Schema({
  name: { type: String, required: true, unique: true },
}));

exports.Widget = Widget;
exports.Tag = Tag;