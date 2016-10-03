require('babel-core/register');

var merge = require('object-merge');

function wrap(obj) {
  console.log(JSON.stringify(obj));
  return obj;
}

module.exports = merge(require('./nightwatch.json'), {
  'test_settings': {
    'default': {
      'launch_url': 'http://' + (process.env.SERVICE_HOST || 'localhost') + ':' + (process.env.SERVICE_PORT || '8080')
    }
  }
});