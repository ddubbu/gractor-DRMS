const ElasticsearchService = require('../interfaces/ElasticsearchService');

const FAKE_DATA_REPORTS = [
  {
    "key": "보고",
    "doc_count": 0,
    "include_source": {
      "hits": {
        "hits": [
          {
            "_index": "report",
            "_type": "_doc",
            "_id": "temp",
            "_source": {
              "unit": "건"
            }
          }
        ]
      }
    }
  },
  {
    "key": "확진자",
    "doc_count": 0,
    "include_source": {
      "hits": {
        "hits": [
          {
            "_index": "report",
            "_type": "_doc",
            "_id": "temp",
            "_source": {
              "unit": "명"
            }
          }
        ]
      }
    }
  },
  {
    "key": "사망자",
    "doc_count": 0,
    "include_source": {
      "hits": {
        "hits": [
          {
            "_index": "report",
            "_type": "_doc",
            "_id": "temp",
            "_source": {
              "unit": "명"
            }
          }
        ]
      }
    }
  },
  {
    "key": "조사중",
    "doc_count": 0,
    "include_source": {
      "hits": {
        "hits": [
          {
            "_index": "report",
            "_type": "_doc",
            "_id": "temp",
            "_source": {
              "unit": "명"
            }
          }
        ]
      }
    }
  }
]

class DisasterService extends ElasticsearchService {
  static index = ['disaster']

  /**
   * [constructor description]
   * @return {[type]} options.router     [description]
   */
  constructor({ router }) {
    super()
    router.get('/api/dashboard_list', (req, res, next) => this.getDashBoardAll(req, res).catch(next))
    router.get('/api/dashboard', (req, res, next) => this.getDashBoard(req, res).catch(next));
    router.get('/api/disaster_info', (req, res, next) => this.getDisasterInfo(req, res).catch(next))
    router.get('/api/disaster_category', (req, res, next) => this.getDisasterCategory(req, res).catch(next))
    router.put('/api/dashboard', (req, res, next) => this.modifyDashBoard(req, res).catch(next))

    this.router = router
  }

  //! refresh 이후 user_id 없으면
  async getUserIdFromSession(req, res) {
    console.log("[checkSession] req.session", req.session);


    const {
      body: {
        hits: { hits: rows },
      },
    } = await this.elastic.search({
      index: 'drms-user',

      body: {
        "query": {
          "bool": {
            "must": [
              { "match": { "email": req.session.user_email } },
            ]
          }
        }
      },
    })

    return rows[0]._id;
  }

  async getDashBoardAll(req, res) {
    console.log('GET axios')

    if (!req.session.user_email) { // || req.query.user_id.length === 0
      console.log("req.session", req.session);
      res.status(404).send('expired');
    } else {


      console.log("req.query", req.query)
      let { user_id } = req.query;

      //! user_id 없으면?
      if (!user_id) {
        user_id = await this.getUserIdFromSession(req, res);
      }

      console.log("user_id", user_id)
      // 존재 확인 
      const {
        body: {
          hits: { hits: rows },
        },
      } = await this.elastic.search({
        index: 'dashboard',
        body: {
          "query": {
            match: {
              "members.others_id": user_id
            }
          }
        },
      });

      // console.log("rows", rows)


      res.send({
        rows,
        user_id
      })


    }

  }

  async getDashBoard(req, res) {
    console.log('GET axios')

    console.log("req.query", req.query)
    const { disaster_control_number, dashboard_id } = req.query;


    const { body: { responses } } = await this.elastic.msearch({
      body: [
        { index: 'disaster' },
        { query: { match: { control_number: disaster_control_number ? disaster_control_number : 1 } } },
        { index: 'dashboard' },
        { query: { match: { _id: dashboard_id } } },
        { index: "report" },
        {
          query: { match: { dashboard_id: dashboard_id } },
          aggs: {
            group_by_category: {
              terms: { field: "category", order: { condition: "asc" } },
              aggs: {
                condition: { min: { field: "priority" } },
                include_source: { top_hits: { "_source": { includes: ["unit"] } } }
              }
            }
          },
          size: 10000
        }
      ],
    })


    console.log("result", responses[0]);
    console.log("==============\n", responses[1]);
    console.log("==============\n", responses[2]);

    let temp_agg_category = !responses[2].err ? responses[2].aggregations.group_by_category.buckets : []
    if (responses[2].err || responses[2].aggregations.group_by_category.buckets.length === 0) {
      temp_agg_category = FAKE_DATA_REPORTS;
    } else if (responses[2].aggregations.group_by_category.buckets.length === 1) {
      temp_agg_category.push(...FAKE_DATA_REPORTS.slice(1))
    }

    // res.send(404)
    // console.log("----------------\n", responses[1].hits.hits[0]._source);
    // console.log("------------\n", responses[2])


    //! 새로고침 문제 해결
    let user_id;
    if (req.session.user_email) {
      user_id = await this.getUserIdFromSession(req, res);
    }


    res.send({
      disaster_info: !responses[0].err ? responses[0].hits.hits[0]._source : {},
      dashboard_info: !responses[1].err ? responses[1].hits.hits[0]._source : {},
      reports_data: {
        rows: !responses[2].err ? responses[2].hits.hits : [],
        agg_category: temp_agg_category
        // agg_category: !responses[2].err ? responses[2].aggregations.group_by_category.buckets : FAKE_DATA_REPORTS//[]
      },
      user_id
    })
  }

  async getDisasterInfo(req, res) {

    // if (!req.session.user_email) {
    //   console.log("req.session", req.session);
    //   res.send('expired');
    // } else {

    const { control_number } = req.query;

    const {
      body: {
        hits: {
          hits
        }
      }
    } = await this.elastic.search({
      index: "disaster",
      size: 1,
      body: {
        query: {
          match: {
            control_number
          }
        },
      },
    })

    // console.log("result", result)
    res.send(hits[0]._source)
  }
  // }

  async getDisasterCategory(req, res) {

    const {
      body: {
        hits: {
          hits
        }
      }
    } = await this.elastic.search({
      index: "disaster",
      size: 100
      // body: {
      //   fields: ["control_number", "name"],
      //   _source: false,
      //   size: 100,
      //   query: { match_all: {} }
      // },
    })
    console.log("result", hits)


    let user_id;
    if (req.session.user_email) {
      user_id = await this.getUserIdFromSession(req, res);
    }

    // const result = hits.map(row => {
    //   return {
    //     control_number: row.fields.control_number[0],
    //     name: row.fields.name[0]
    //   }
    // })

    const result = hits.map(row => {
      return {
        control_number: row._source.control_number,
        name: row._source.name
      }
    })

    res.send({
      result,
      user_id
    })
  }

  ////////////////////////////////////////

  async modifyDashBoard(req, res) {
    console.log("axios PUT");
    console.log(req.body);

    if (!req.session.user_email) {
      console.log("req.session", req.session);
      res.send('expired');
    } else {
      const { id, payload } = req.body;

      const result = await this.elastic.update({
        index: 'dashboard',
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

  }
}

module.exports = DisasterService
