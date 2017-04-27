var path = require('path'),
  rootPath = path.normalize(__dirname + '/..'),
  env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'session-validator'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/session-validator-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'session-validator'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/session-validator-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'session-validator'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/session-validator-production'
  }
};

module.exports = config[env];
