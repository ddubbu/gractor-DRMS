const ElasticsearchService = require('../interfaces/ElasticsearchService')

class DashboardService extends ElasticsearchService {
  static index = ['dashboard']

  /**
   * [constructor description]
   * @return {[type]} options.router     [description]
   */
  constructor({ router }) {
    super()
    // Controller, Service 동시에
    router.post('/api/dashboard', (req, res, next) => this.createDashboard(req, res).catch(next))
    router.post('/api/report', (req, res, next) => this.createReport(req, res).catch(next))
    this.router = router
  }

  async createDashboard(req, res) {
    console.log('axios post')
    const payload = req.body

    const { title, control_number, user_id } = payload;

    console.log("payload", payload)
    // res.send("hello")
    const body = {
      "title": title,
      "situation_type": "practice",
      "disaster_control_number": 1,
      "cur_response_level": 1,
      "start_date": "2020-03-04",
      "members": {
        "manager_id": [user_id],
        "others_id": [user_id]
      },
      "task_states": {
        "1-1": { "state": "todo" },
        "2-1": { "state": "todo" },
        "2-2": { "state": "todo" },
        "3-2": { "state": "todo" },
        "20-1": { "state": "todo" },
        "47-1": { "state": "todo" },
        "4-1": { "state": "todo" },
        "5-1": { "state": "todo" },
        "5-2": { "state": "todo" },
        "7-5": { "state": "todo" },
        "7-6": { "state": "todo" },
        "4-2": { "state": "todo" },
        "6-1": { "state": "todo" },
        "49-1": { "state": "todo" },
        "47-2": { "state": "todo" },
        "49-2": { "state": "todo" },
        "26-2": { "state": "todo" },
        "26-3": { "state": "todo" },
        "34-1": { "state": "todo" },
        "34-17": { "state": "todo" },
        "10-4": { "state": "todo" },
        "12-2": { "state": "todo" },
        "38-1": { "state": "todo" },
        "40-5": { "state": "todo" },
        "40-10": { "state": "todo" },
        "40-11": { "state": "todo" },
        "50-1": { "state": "todo" },
        "48-1": { "state": "todo" },
        "13-3": { "state": "todo" },
        "13-4": { "state": "todo" },
        "13-5": { "state": "todo" },
        "14-2": { "state": "todo" },
        "14-4": { "state": "todo" },
        "21-8": { "state": "todo" },
        "41-2": { "state": "todo" },
        "47-4": { "state": "todo" },
        "26-7": { "state": "todo" }
      }
    }
    // // 중복 확인
    if (!req.session.user_email) {
      console.log("req.session", req.session);
      res.status(404).send('expired');
    } else {
      // 괜찮으면 넣기 
      const {
        body: { _id },
        statusCode,
      } = await this.elastic.index({
        index: DashboardService.index,
        body: body,
        refresh: 'wait_for'
      })
      res.send({ id: _id, statusCode: statusCode })
    }
  }

  async createReport(req, res) {
    console.log('axios post')
    const payload = req.body

    // const { title, control_number, user_id } = payload;

    console.log("payload", payload)
    // res.send("hello")x
    // const body = {}
    // // 중복 확인
    console.log("req.session", req.session);

    if (!req.session.user_email) {
      console.log("req.session", req.session);
      res.status(404).send('expired');
    } else {
      // 괜찮으면 넣기 
      // const {
      //   body: { _id },
      //   statusCode,
      // }
      
     const result = await this.elastic.index({
        index: 'report', //DashboardService.index,
        body: payload,
        refresh: 'wait_for'
      });
      console.log("result", result)
      res.send('hello')
      // res.send({ id: _id, statusCode: statusCode })
    }
  }
}


module.exports = DashboardService
