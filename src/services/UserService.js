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
    router.put('/api/users', (req, res, next) => this.updateUser(req, res).catch(next))
    router.delete('/api/users', (req, res, next) => this.deleteUser(req, res).catch(next))

    this.router = router
  }

  async createUser(req, res) {
    console.log('axios post')
    const body = req.body
    console.log('req.body', body)

    const {
      body: { _id },
      statusCode,
    } = await this.elastic.index({
      index: UserService.index,
      body,
    })

    res.send({ id: _id, statusCode: statusCode })
  }

  async searchUser(req, res) {
    console.log('GET axios')

    const { size } = req.query;
    console.log("req.params", req.params)
    const elasticQuery = {
      match_all: {},
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

  async updateUser(req, res) {
    console.log('UPDATE axios')
    const { id, payload } = req.body
    const result = await this.elastic.update({
      index: UserService.index,
      id,
      body: {
        doc: {
          //! 이거 들어가야한다니...
          ...payload,
        },
      },
    })
    console.log('UPDATE response', result)
    res.send(result)
  }

  async deleteUser(req, res) {
    console.log('DELTE axios')
    const { id } = req.query
    console.log("delete id", id)
    const result = await this.elastic.delete({
      index: UserService.index,
      id,
      refresh: 'wait_for',
    })

    res.send(result)
  }
}

module.exports = UserService
