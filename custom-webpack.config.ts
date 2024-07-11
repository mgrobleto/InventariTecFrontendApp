import { plugins } from 'chart.js'
import { EnvironmentPlugin } from 'webpack'
const Dotenv = require('dotenv')

module.exports = {
  plugins: [
    new Dotenv(),
  ]
}