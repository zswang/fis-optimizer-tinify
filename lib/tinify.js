/**
 * @file fis-optimizer-tinify
 *
 * fis optimizer plugin
 * @author
 *   zswang (http://weibo.com/zswang)
 * @version 0.0.3
 * @date 2015-11-11
 */
var tinify = require('tinify');
var deasync = require('deasync');
var crypto = require('crypto');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');
var keyIndex = parseInt(Math.random() * 100);
module.exports = function (content, file, conf) {
  var key;
  if (conf.key instanceof Array) {
    key = conf.key[(keyIndex++) % conf.key.length];
  } else {
    key = conf.key; // "YOUR_API_KEY";
  }
  if (!key) {
    throw new Error('config "key" undefined.');
  }
  tinify.key = key;
  var compress = deasync(function (content, callback) {
    var image;
    if (conf.cacheDir) {
      mkdirp.sync(conf.cacheDir);
      var md5 = crypto.createHash('md5');
      md5.update(content);
      var flag = md5.digest('hex');
      image = path.join(conf.cacheDir,
        flag + (file.ext || path.extname(file.filename))
      );
      if (fs.existsSync(image)) {
        callback(null, fs.readFileSync(image));
        return;
      }
    }
    tinify.Source.fromBuffer(content).toBuffer().then(function (data) {
      if (image) {
        fs.writeFileSync(image, data); // 缓存
      }
      callback(null, data);
    }).catch(function (error) {
      console.error('tinify.key: %s', tinify.key);
      callback(error);
    })
  });
  return compress(content);
};