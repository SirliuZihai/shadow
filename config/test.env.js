'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  API_HOST: '"http://47.112.131.22:8088/myapp/"',
  API_WS: '"ws://47.112.131.22:8088/myapp/"',
  API_BDMAP: '"http://api.map.baidu.com"'
})
