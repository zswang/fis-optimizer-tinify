/*<jdists encoding="ejs" data="../package.json">*/
/**
 * @file <%- name %>
 *
 * <%- description %>
 * @author
     <% (author instanceof Array ? author : [author]).forEach(function (item) { %>
 *   <%- item.name %> (<%- item.url %>)
     <% }); %>
 * @version <%- version %>
     <% var now = new Date() %>
 * @date <%- [
      now.getFullYear(),
      now.getMonth() + 101,
      now.getDate() + 100
    ].join('-').replace(/-1/g, '-') %>
 */
/*</jdists>*/

/*<remove>*/
/*jslint node: true */
"use strict";
/*</remove>*/

var tinify = require("tinify");
var isPng = require("is-png");
var deasync = require("deasync");
var crypto = require("crypto");
var mkdirp = require("mkdirp");
var path = require("path");
var fs = require("fs");

var keyIndex = parseInt(Math.random() * 100);
var blacklist = {};

module.exports = function(content, file, conf) {
  if (!isPng(new Buffer(content).slice(0, 8))) {
    console.log("%j is not PNG format.", file.filename);
    // 非 png 直接返回
    return content;
  }
  var compress = deasync(function(content, callback) {
    var image;
    if (conf.cacheDir) {
      mkdirp.sync(conf.cacheDir);
      var md5 = crypto.createHash("md5");
      md5.update(content);
      var flag = md5.digest("hex");

      image = path.join(
        conf.cacheDir,
        flag + (file.ext || path.extname(file.filename))
      );
      if (fs.existsSync(image)) {
        callback(null, fs.readFileSync(image));
        return;
      }
    }

    /**
     * 尝试上传
     * @param correction 是否纠错
     */
    function attempt(correction) {
      var key;
      var lastError;
      var firstKeyIndex;
      if (conf.key instanceof Array) {
        keyIndex = (keyIndex + 1) % conf.key.length;
        if (correction) {
          if (firstKeyIndex === keyIndex) {
            callback(lastError);
            return;
          }
        } else {
          firstKeyIndex = keyIndex;
        }
        key = conf.key[keyIndex];
      } else {
        if (correction) {
          callback(lastError);
          return;
        }
        key = conf.key; // "YOUR_API_KEY";
      }
      if (!key) {
        throw new Error('config "key" undefined.');
      }

      if (blacklist[key]) {
        attempt(true);
        return;
      }

      if (conf.debug) {
        // 关键信息
        console.log(
          "\nkey: %j flag: %j filename: %j",
          key,
          flag,
          file.realpath
        );
      }
      tinify.key = key;
      tinify.Source.fromBuffer(content)
        .toBuffer()
        .then(function(data) {
          if (image) {
            fs.writeFileSync(image, data); // 缓存
          }
          callback(null, data);
        })
        .catch(function(error) {
          lastError = error;
          attempt(true);
          blacklist[key] = true;
          console.error("Error: tinify.key: %s", key);
        });
    }

    attempt(false);
  });
  return compress(content);
};
