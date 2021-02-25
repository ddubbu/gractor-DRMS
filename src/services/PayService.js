const ElasticsearchService = require('../interfaces/ElasticsearchService')

class UserService extends ElasticsearchService {
  static index = ['local-pay-1', 'local-pay-2']

  /**
   * [constructor description]
   * @return {[type]} options.router     [description]
   */
  constructor({ router }) {
    super()
    // Controller, Service 동시에
    router.get('/api/pay', (req, res, next) => this.searchPay(req, res).catch(next))

    this.router = router
  }

  async searchPay(req, res) {

    console.log("req.query", req.query)
    const { size, region, category } = req.query

    const elasticQuery = {

      //  select * from 'index table' where 시군명="" and 업종명(종목명)= "일반휴게음식-일반한식"
      "bool": {
        "must": [
          { "match": { "시군명": region } },
          {
            "wildcard": {
              "업종명(종목명)": `*${category}*`
            }
          }
        ]
      }

    }

    const {
      body: {
        hits: { hits: rows },
        aggregations
      },
    } = await this.elastic.search({
      index: UserService.index,
      from: 0, //!
      size: size ? size : 100, //20, // default : 10
      body: {
        query: elasticQuery,
        // aggs: {
        //   '시군명 요약': {
        //     terms: {
        //       field: '시군명',
        //     },
        //   },
        //   '업종별 요약': {
        //     terms: {
        //       field: '업종명(종목명)',
        //     },
        //   },
        // },

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
