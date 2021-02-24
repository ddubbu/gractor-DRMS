const ElasticsearchService = require('../interfaces/ElasticsearchService')

class UserService extends ElasticsearchService {
  static index = ['airtest']

  /**
   * [constructor description]
   * @return {[type]} options.router     [description]
   */
  constructor({ router }) {
    super()
    // Controller, Service 동시에
    router.get('/api/chart', (req, res, next) => this.searchChart(req, res).catch(next))

    this.router = router
  }



  async searchChart(req, res) {
    console.log("GET axios")

    const { size } = req.query;
    const elasticQuery = {
      match_all: {},
    }

    const {
      body: {
        hits: { hits: rows },
        aggregations
      },
    } = await this.elastic.search({
      index: UserService.index,
      size: size ? size : 200, // default : 10

      body: {
        query: elasticQuery,
        aggs: {
          "시설군 요약": {
            terms: {
              field: "시설군"
            }
          }
        },
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

    res.send({ rows, total, aggregations })
  }



}

module.exports = UserService
