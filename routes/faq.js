var express = require("express");
var router = express.Router();
var modules = require("../modules");
var mapper = require("./mapperCs.js");

/* GET fag */
router.get("/", async function (req, res) {
  try {
    // 포스트 목록
    let sql = mapper.sqlFaqList;
    let result = await modules.pg.query(sql);
    let data = {insurance:[], finance:[], life:[]};

    for (let i=0; i<result.length; i++) {
        if (result[i].category === 'insurance') {
            data.insurance.push(result[i]);
        } else if (result[i].category === 'finance') {
            data.finance.push(result[i]);
        } else {
            data.life.push(result[i]);
        }
    }
    res.render("faq", {
        title: '자주하는 질문',
        data: data
    });
  } catch (err) {
    res.redirect("/");
  }
});

router.post("/consult", async function (req, res) {
    try {
        let sql = mapper.sqlConsultSeq;
        let result = await modules.pg.query(sql);
        
        req.body.seq = parseInt(result[0].seq)+1;           // 삼당고유번호
        req.body.inflow_route = 'HFF_IN_01';    // 유입채널
        req.body.agree = 'Y';                   // 약관동의
        req.body.cnslDtmFrom = req.body.cnslDtm.substr(0,4);
        req.body.cnslDtmTo = req.body.cnslDtm.substr(4,4);

        console.log(req.body);
        
        // GPS
        // let result_consult = await modules.axios.postConsultGps(req.body);

        res.json({result:"200", msg: '상담신청이 완료되었습니다.'});

    } catch (err) {

    }
});

module.exports = router;
