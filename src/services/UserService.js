const ElasticsearchService = require('../interfaces/ElasticsearchService')

class UserService extends ElasticsearchService {
  static index = ['rapidfire-user']

  /**
   * [constructor description]
   * @return {[type]} options.router     [description]
   */
  constructor({ router }) {
    super()
    // Controller, Service 동시에
    router.get('/api/users', (req, res, next) => this.searchUser(req, res).catch(next))
    router.post('/api/users', (req, res, next) => this.createUser(req, res).catch(next))

    this.router = router
  }

  async createUser() {
    const body = req.body

    this.elastic.index({
      index: UserService.index,
      body,
    })
  }

  async searchUser(req, res) {
    console.log(UserService)
    const elasticQuery = {
      match_all: {},
    }

    const {
      body: {
        hits: { hits: rows },
      },
    } = await this.elastic.search({
      index: UserService.index,
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
