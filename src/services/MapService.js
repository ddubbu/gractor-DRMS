const ElasticsearchService = require('../interfaces/ElasticsearchService')

class MQTTService extends ElasticsearchService {
  // static index = ['danger-facility']

  /**
   * [constructor description]
   * @return {[type]} options.router     [description]
   */
  constructor({ router }) {
    super()

    // Controller, Service 동시에
    //! map 띄우기 위해서
    router.get('/api/map', (req, res, next) => this.getMap(req, res).catch(next));


    //! mqtt data save 를 위해서 (아직 작업 중 ....)
    router.get('/api/mqtt', (req, res, next) => this.searchData(req, res).catch(next))
    router.post('/api/mqtt', (req, res, next) => this.createData(req, res).catch(next))
    this.router = router
  }

  async getMap(req, res) {
    const {
      body: {
        hits: { hits: rows },
      },
    } = await this.elastic.search({
      index: 'guro-facility-device',
      size: 700,
      body: {
        query: {
          match_all: {}
        },
      }
    });

    res.send(rows)

  }

  async searchData(req, res) {
    // const payload = req.body
    // console.log("payload", payload)

    // 존재 확인 
    const {
      body: {
        hits: { hits: rows },
      },
    } = await this.elastic.search({
      index: 'danger-facility',
      body: {
        query: {
          match_all: {}
        },
      }
    });

    res.send(rows)

  }

  async createData(req, res) {
    console.log('axios post')
    const payload = req.body

    // 괜찮으면 넣기 
    const {
      body: { _id },
      statusCode,
    } = await this.elastic.index({
      index: 'danger-facility',
      body: payload,
    })

    res.send({ id: _id, statusCode: statusCode })

  }
}

module.exports = MQTTService
