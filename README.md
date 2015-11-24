fis-optimizer-tinify
=================

[![NPM version](https://img.shields.io/npm/v/fis-optimizer-tinify.svg)](http://badge.fury.io/js/fis-optimizer-tinify)

## 背景

Web 应用，图片是最占带宽的静态资源！

TinyPNG 是一个不错的图片压缩工具，压缩率平均可达 30%。

## 功能点

* 本地缓存已经压缩过的图片，增量压缩不会浪费请求。
* 自己发现...

## 配置示例

```js
fis.match(/\.(png)$/i, {
    optimizer: fis.plugin('tinify', {
      key: [
        ...
      ],
      cacheDir: __dirname + '/.cache'
    })
  })
```

fis 插件 - tinify 图片压缩

参考：https://tinypng.com/
