const axios = require('axios');
const config = require(`../config/${process.env.NODE_ENV}.json`);


const postConsultGps = async(data) => {
    return await axios({
        method: 'post', 
        url: config.host.gps + '/api/hanaEmpathy/hffgp0001',
        data: data
    }).then(function (res) {
        console.log(res);
        return res.data;
    }).catch(function (err) {
        console.log(err);
        return err;
    });
};

module.exports = {
    postConsultGps: postConsultGps
}