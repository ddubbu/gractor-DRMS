const ElasticsearchService = require('../interfaces/ElasticsearchService')

class UserService extends ElasticsearchService {
  static index = ['local-pay-1']

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
    console.log('GET axios22222')

    const { size, region, category } = req.query
    // /api/pay?size=20&region=가평군&....
    
    // console.log("req.querybnaskldnaksndlks",req)
    // region = rows.
    const elasticQuery = {
        bool:{
            must:[
            {"match" : {"시군명" : region}},
            {"match" : {"업종명(종목명)": category}}
            ]
          }
    //  select * from 'index table' where 시군명="" and 업종명(종목명)= "일반휴게음식-일반한식"
    }
    // const {
    //     body:{hits:rows},
    // }=await this.elastic.search({
    //     index: UserService.index,
        
    // })
    const {
      body: {
        hits: { hits: rows },
        aggregations
      },
    } = await this.elastic.search({
      index: UserService.index,
    //   region :region ,
    //   category:category,
    
      size: size ? size : 20, // default : 10
      body: {
        query: elasticQuery,
        aggs: {
            '시군명 요약': {
              terms: {
                field: '시군명',
              },
            },
            '업종별 요약': {
                terms: {
                  field: '업종명(종목명)',
                },
              },
          },
    
      },
    })

    console.log("rows222222", aggregations)

    const {
      body: { count: total },
    } = await this.elastic.count({
      index: UserService.index,
      body: {
        query: elasticQuery,
      },
    })

    res.send({ rows, total, aggregations})
  }

}

module.exports = UserService
