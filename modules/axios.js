const axios = require('axios');

const postConsultGps = async(data) => {
    axios({
        method: 'post', 
        url: 'http://183.109.29.98:18180/api/hanaEmpathy/hffgp0001',
        data: data
    }).then(function (res) {
        console.log(res);
        return res;
    }).catch(function (err) {
        console.log(err);
        return err;
    });
};

module.exports = {
    postConsultGps: postConsultGps
}