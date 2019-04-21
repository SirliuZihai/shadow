'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HOST:"/api/",
  API_WS:'"ws://192.168.137.1:8080/myws/"',
  API_BDMAP:"/bdmapapi/"
})
