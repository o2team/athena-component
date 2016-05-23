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
  pullTimes: { type: Number, default: 0 }
}));

exports.Widget = Widget;