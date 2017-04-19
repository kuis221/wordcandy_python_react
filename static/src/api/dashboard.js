import axios from 'axios';

export let url = 'http://0.0.0.0:8000/v1/';

exports.apiDashboard = {
    export: function(data) {
        return axios({
                url: url + "dashboard/excel/",
                method: 'post',
                responseType: 'json',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data,
                validateStatus: function (status) {
                  return status;
                }
            })
            .then(response => {
                return response;
            }).catch(function(error) {
                return error;
            });
    },
}
