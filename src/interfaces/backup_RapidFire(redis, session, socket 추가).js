const fs = require('fs')
const path = require('path')

const { URL } = require('url')
const qs = require('qs')

const express = require('express')
const consola = require('consola')

const bodyParser = require('body-parser')

const EventEmitter = require('events')
const { ServiceLoader, Controller } = require('../interfaces')

/**
 * @typedef   {Object}    RapidFireOptions
 * @property  {Array}     isDev                RapidFire Development Mode
 * @property  {Array}     dbs                  DB Clients
 * @property  {Object}    paths                RapidFire Paths
 * @property  {String}    paths.controllers    RapidFire User Define Controllers Path
 * @property  {String}    paths.services       RapidFire User Define Services Path
 * @property  {String}    paths.middlewares    RapidFire User Define Middlewares Path
 * @property  {String}    paths.loaders        RapidFire User Define Loaders Path
 * @property  {Array}     middlewares          RapidFire Ordered Middleware Filenames In `options.paths.middlewares`
 */

/**
 * @class
 * @extends EventEmitter
 * @mermaid
 *   graph TD;
 *     EventEmitter --> RapidFire;
 */
class RapidFire extends EventEmitter {
  /**
   * RapidFire Default Options
   *
   * @static
   * @type     {Object}
   * @property {RapidFireOptions}     options      RapidFire Framework Default Constructor Options
   */
  static defaults = {
    options: {
      dbs: [],
      isDev: process.env.NODE_ENV !== 'production',
      paths: {
        controllers: '',
        services: '',
        middlewares: '',
        loaders: '',
      },
      middlewares: [],
      querystringParser: {
        normalize: {
          true: true,
          false: false,
          null: null,
          undefined,
        },
      },
    },
  }

  /**
   * Create RapidFire Framework
   *
   * @param  {RapidFireOptions}
   */
  constructor({ dbs = [], ...options } = {}) {
    super()

    let customOptions = {}

    if (typeof options === 'string') customOptions = require(path.join(__dirname, options))
    else customOptions = options

    /**
     * RapidFire Framework Running Options
     *
     * @member
     * @type     {Object}
     * @property {RapidFireOptions}     options      RapidFire Framework Running Environment
     */
    this.options = {
      ...RapidFire.defaults.options,
      ...customOptions,
    }

    /**
     * RapidFire Framework Running Environments.
     * This Options Is Not Configurable. Only Depends System Environments.
     *
     * @member
     * @type     {Object}
     * @property {Object}     paths         System Paths
     * @property {Object}     paths.root    Current Working Directory
     */
    this.env = {
      paths: {
        root: process.env.PWD,
      },
    }

    /**
     * {@link https://nodejs.org/api/http.html#http_class_http_server HttpServer}
     *
     * @member
     * @type {HttpServer}
     */
    this.server = null
    /**
     * DB Clients
     *
     * @member
     * @type {Array}
     */
    this.dbs = dbs
    /**
     * {@link https://expressjs.com/ko/api.html#app HttpServer}
     *
     * @member
     * @type {ExpressApplicationInstance}
     */
    this.app = express()

    const defaultController = new Controller()
    defaultController.$rapidfire = this
    /**
     * RapidFire Framework Running Controller Instances
     *
     * @member
     * @type {Array}
     */
    this.controllers = [defaultController]

    /**
     * RapidFire Framework Running Service Instances
     *
     * @member
     * @type {Array}
     */
    this.services = []
    /**
     * RapidFire Framework Running Middleware Instances
     *
     * @member
     * @type {Array}
     */
    this.middlewares = []

    const defaultServiceLoader = new ServiceLoader()
    defaultServiceLoader.$rapidfire = this
    /**
     * RapidFire Framework Running ServiceLoader Instances
     *
     * @member
     * @type {Array}
     */
    this.loaders = [defaultServiceLoader]
  }

  /**
   * StartUp RapidFire Framework.
   */
  async ignition() {
    const { isDev } = this.options

    if (isDev) global.$rapidfire = this

    // ------------------------ Load Contollers
    if (this.options.paths.controllers) {
      const controllerFilenames = fs.readdirSync(this.options.paths.controllers)
      const controllers = []
      for (const controllerFilename of controllerFilenames) {
        const Controller = require(path.join(this.options.paths.controllers, controllerFilename))
        const controller = new Controller()

        // Register Middleware Default Variables
        controller.$rapidfire = this

        controllers.push(controller)
      }
      this.controllers = controllers
    }

    // ------------------------ Load Loaders
    if (this.options.paths.loaders) {
      const loaderFilenames = fs.readdirSync(this.options.paths.loaders)
      const loaders = []
      for (const loaderFilename of loaderFilenames) {
        const Loader = require(path.join(this.options.paths.loaders, loaderFilename))
        const loader = new Loader()

        // Register Middleware Default Variables
        loader.$rapidfire = this

        loaders.push(loader)
      }
      this.loaders = loaders
    }

    //! (시작) 선미가 추가함 for redis

    //! login관련
    // ------------------------ Install redis
    const session = require('express-session');
    const RedisStore = require('connect-redis')(session);
    const redis = require('redis');

    const redis_client = redis.createClient(6379, 'localhost');

    this.app.use(session({
      store: new RedisStore({
        client: redis_client,
        ttl: 60 * 10 //세션 유효기간 [s]
      }),
      secret: 'helloworld',
      resave: false,
      saveUninitialized: false,
    }))


    //! (끝) 선미가 추가함 for redis

    // ------------------------ Built-in Request Pre Middlewares
    const qsNormalizeKeywords = this.options.querystringParser.normalize
    this.app.use((req, res, next) => {
      if (req.originalUrl.includes('?')) {
        const { search } = new URL(req.url, `${req.protocol}://${req.hostname}`)

        req.query = qs.parse(search.substr(1), {
          arrayLimit: 10000,
          decoder(str, decoder, charset, type) {
            const value = decoder(str, decoder, charset, type)

            if (/^(\d+|\d*\.\d+)$/.test(value)) return parseFloat(value)
            if (value in qsNormalizeKeywords) return qsNormalizeKeywords[value]
            return value
          },
        })
      }

      next()
    })

    this.app.use(bodyParser.json())

    // ------------------------ Install Controller / Bind Service
    if (this.options.paths.services) {
      const serviceFilenames = fs.readdirSync(this.options.paths.services)
      const services = []
      for (const serviceFilename of serviceFilenames) {
        const Service = require(path.join(this.options.paths.services, serviceFilename))

        const serviceLoader = this.loaders.find(loader => loader instanceof Service.loader)
        const service = await serviceLoader.load({ express, Service }) //, SocketIo }) //!선미

        if (service.router) this.app.use(service.router)

        services.push(service)
      }
      this.services = services
    }

    // ------------------------ Install Post Middlewares
    if (this.options.paths.middlewares) {
      const middlewareFilenames = this.options.middlewares.length <= 0 ? fs.readdirSync(this.options.paths.middlewares) : this.options.middlewares
      const middlewares = []
      for (const middlewareFilename of middlewareFilenames) {
        const Middleware = require(path.join(this.options.paths.middlewares, middlewareFilename))
        const middleware = new Middleware()

        middleware.$rapidfire = this

        await middleware.init()

        middlewares.push(middleware)
      }

      this.middlewares = middlewares

      for (const middleware of this.middlewares) {
        for (const { pattern, pipe } of middleware.pipelines) {
          if (pipe instanceof Function) {
            if (pattern) this.app.use(pattern, pipe)
            else this.app.use(pipe)
          }
        }
      }
    }

    // eslint-disable-next-line no-unused-vars
    this.app.use((err, req, res, next) => {
      consola.error(err)

      if (res.headersSent) return next(err)

      res.status(err.code || 500).send(err.message)
    })

    // ------------------------ Start server
    this.server = this.app.listen(this.options.port, this.options.host, () => {
      consola.ready(`Server listening on http://${this.options.host}:${this.options.port}`)
      /**
       * HttpServer Is Ready To Listen
       *
       * @event RapidFire#open
       */
      this.emit('open')
    })

    //! (시작) 선미 socket io 추가함
    const mqtt = require('mqtt')

    //! 2. mqtt 연결
    const client = mqtt.connect('ws://192.168.1.91:1884');
    client.on('connect', () => {
      // client.subscribe('test', { qos: 2 });
      client.subscribe('/Gractor/kim/#', { qos: 2 });
      console.log('연결완료 .....');
    });

    const io = require('socket.io')(this.server);

    io.on('connection', (socket) => {
      console.log("%s sockets connected : server ----> client", io.engine.clientsCount)
      //! chat submit 용
      socket.on('chat', ({ data }) => {
        console.log('[Server]', data)
        socket.broadcast.emit('chat2', data);
      })

      socket.on("disconnect", function (data) {
        console.log('disconnected :', socket.id);
      });

      // mqtt client
      //! mqtt 용
      client.on('message', (topic, message, packet) => {
        console.log('new message: ', message.toString());

        // !socket으로 날리기
        // socket.broadcast.emit('chat2', message.toString());
        socket.emit('chat2', message.toString());
      });


    });
    //! (끝) 선미 socket io 추가함



    this.server.on('close', () => {
      this.server = null
      console.info('Server Closed.')
      /**
       * HttpServer Is Stop To Listen
       *
       * @event RapidFire#close
       */
      this.emit('close')
    })

  }

  extinguish() {
    for (const client of this.dbs) {
      if (client && client.close instanceof Function) {
        try {
          client.close()
        } catch (err) {
          consola.error(err)
        }
      }
    }

    if (this.server) this.server.close()

    // ! MQTT 끄기
    if (client) {
      io.end();
      client.end();
    }
  }
}

module.exports = RapidFire
