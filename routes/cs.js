var express = require("express");
var router = express.Router();
var modules = require("../modules");
var mapperCs = require("./mapperCs.js");
var mapper = require("./mapper.js");

/* GET fag */
router.get("/faq", async function (req, res) {
  try {
    // 포스트 목록
    let result = await modules.pg.query(mapperCs.selectFaqList);
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
    res.render("cs/faq", {
        title: '자주하는 질문',
        data: data
    });
  } catch (err) {
    res.redirect("/");
  }
});

router.get("/consultant", async function (req, res) {
    res.render('cs/consultant');
});

router.get("/consultantComplete", async function (req, res) {
    try {
        let sql = mapper.sqlRecommandPost + ` LIMIT 2`;
        let result = await modules.pg.query(sql);

        res.render('cs/consultant_complete', {
            data_recommand: result
        });
    } catch (err) {
        res.redirect("/");
    }
});

router.post("/postConsultant", async function (req, res) {
    try {
        let result = await modules.pg.query(mapperCs.selectConsultHistorySeq);

        req.body.seq = parseInt(result[0].seq)+1;           // 삼당고유번호
        req.body.inflow_route = 'HFF_IN_01';    // 유입채널
        req.body.agree = 'Y';                   // 약관동의
        req.body.cnslDtmFrom = req.body.cnslDtm.substr(0,4);
        req.body.cnslDtmTo = req.body.cnslDtm.substr(4,4);

        // // GPS
        let resultAxios = await modules.axios.postConsultGps(req.body);
        if (resultAxios.resultCd === '0') {
            let values = [req.body.custNm];
            result = await modules.pg.query(mapperCS.insertConsultHistory, values);
        } else {
            switch (resultAxios.resultMessage) {
                case 'DUP_TLNO':
                    resultAxios.resultMessage = '이미 상담 등록된 연락처입니다.';
                    break;
            }
        }
        res.json({code:resultAxios.resultCd, msg: resultAxios.resultMessage});

    } catch (err) {
        res.redirect("/");
    }
});

module.exports = router;
