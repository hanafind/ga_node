var express = require("express");
var router = express.Router();
var modules = require("../modules");
var mapper = require("./mapper.js");
// const axios = require('axios');

/* GET fag */
router.get("/", async function (req, res) {
  try {
    // 포스트 목록
    let sql = `select * from blog.faq;`;
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
        data: data,
    });
  } catch (err) {
    res.redirect("/");
  }
});

router.post("/consult", async function (req, res) {
    try {
        let sql = `SELECT last_value as seq FROM cs.consult_history_idx_seq;`;
        let result = await modules.pg.query(sql);
        console.log('result : ' + result[0].seq);

        req.body.seq = result[0].seq + 1;
        req.body.inflow_route = 'HFF_IN_01';
        
        // let result_consult = await modules.axios.axiosPost(req.body);

        res.status(200).json({msg: "suc"});
        // console.log('result : ' + JSON.stringify(result));

    } catch (err) {

    }
});

module.exports = router;
