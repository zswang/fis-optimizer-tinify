fis-optimizer-tinify
=================

[![NPM version](https://img.shields.io/npm/v/fis-optimizer-tinify.svg)](http://badge.fury.io/js/fis-optimizer-tinify)

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
