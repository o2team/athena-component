'use strict';

const fs = require('fs');
const path = require('path');
const fstream = require('fstream');
const lodash = require('lodash');
const AV = require('leancloud-storage');
const conf = require('../ac-config.js');
// const db = require('../db.js');

const APP_ID = conf.leancloud.APP_ID;
const APP_KEY = conf.leancloud.APP_KEY;
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

module.exports = async (ctx, next) => {
  let id = ctx.request.query.id;
  
  if(!id) { ctx.status = 404; return; }

  await new AV.Query('Widget').get(id).then(function (data) {
    ctx.body = data;
  }, function (err) {
    console.error(err);
    ctx.status = 403;
    ctx.body = err;
  });
}