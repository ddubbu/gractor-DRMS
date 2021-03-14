const path = require('path')

const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);
const redis = require('redis');

const {
  Interfaces: { Middleware },
} = require('@luasenvy/rapidfire')

class ConnectRedisMiddleware extends Middleware {
  constructor() {
    super()

    const client = redis.createClient(6379, 'localhost');

    this.expressSession = expressSession({
      store: new RedisStore({
        client,
        ttl: 24 * 60 * 60 //세션 유효기간 [s]
      }),
      secret: 'helloworld',
      resave: false,
      saveUninitialized: false,
    })
  }

  async init() {
    this.pipelines.push({ pipe: this.expressSession })
  }
}

module.exports = ConnectRedisMiddleware
