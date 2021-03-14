const ElasticsearchService = require('../interfaces/ElasticsearchService')

class UserService extends ElasticsearchService {
  static index = ['drms-user']

  /**
   * [constructor description]
   * @return {[type]} options.router     [description]
   */
  constructor({ router }) {
    super()

    router.get('/api/session', (req, res, next) => this.getSession(req, res).catch(next))

    // Controller, Service 동시에
    router.get('/api/users', (req, res, next) => this.searchUser(req, res).catch(next))
    router.post('/api/signup', (req, res, next) => this.createUser(req, res).catch(next))
    router.post('/api/signin', (req, res, next) => this.signinHandler(req, res).catch(next))
    router.delete('/api/logout', (req, res, next) => this.logoutHandler(req, res).catch(next))
    this.router = router
  }

  // !redis에서 session 가져오기
  getSession(req, res) {
    console.log("You Are In Get Session!")
    console.log("req.session", req.session)
    res.send(req.session)
    // client.get(`sess:${req.session.id}`, (err, data) => {
    //   if (err) res.json({ err })
    //   if (data) {
    //     console.log("로그인 redis 확인", data)
    //   } else {
    //     // next()
    //     console.log("here")
    //   }
    // })
  }


  //signin
  async signinHandler(req, res) {
    const payload = req.body
    console.log("payload", payload)

    // 존재 확인 
    const {
      body: {
        hits: { hits: rows },
      },
    } = await this.elastic.search({
      index: UserService.index,
      body: {
        "query": {
          "bool": {
            "must": [
              { "match": { "email": payload.email } },
              { "match": { "password": payload.password } }
            ]
          }
        }
      },
    });

    if (rows.length > 0) {
      console.log("[Before] session============", req.session)
      req.session.user_email = req.body.email;
      console.log("[After] session============", req.session)
      console.log("[Signin] rows", rows)
      res.send({ user_id: rows[0]._id }); //{ user_id: }
    }
    else res.status(400).send('Already exist')
  }

  //signup
  async createUser(req, res) {
    console.log('axios post')
    const payload = req.body

    // 중복 확인 
    const {
      body: {
        hits: { hits: rows },
      },
    } = await this.elastic.search({
      index: UserService.index,
      body: {
        query: {
          match: {
            email: payload.email
          }
        },
      },
    });

    if (rows.length > 0) res.status(400).send('exist')
    else {
      // 괜찮으면 넣기 
      const {
        body: { _id },
        statusCode,
      } = await this.elastic.index({
        index: UserService.index,
        body: payload,
      })

      res.send({ id: _id, statusCode: statusCode })
    }


  }

  //logout
  async logoutHandler(req, res) {
    req.session.destroy();
    console.log("req.session 파기 완료 ");
    res.status(200).send('ok');
  }

  async searchUser(req, res) {
    console.log('GET axios')

    const { size } = req.query;
    console.log("req.params", req.params)
    const elasticQuery = {
      match_all: {

      },
    }

    const {
      body: {
        hits: { hits: rows },
      },
    } = await this.elastic.search({
      index: UserService.index,
      size: size ? size : 20, // default : 10
      body: {
        query: elasticQuery,
      },
    })

    const {
      body: { count: total },
    } = await this.elastic.count({
      index: UserService.index,
      body: {
        query: elasticQuery,
      },
    })

    res.send({ rows, total })
  }

}

module.exports = UserService
