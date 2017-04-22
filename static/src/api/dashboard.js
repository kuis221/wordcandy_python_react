import axios from 'axios';

export let url = 'http://www.wordcandy.io/v1/';

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
                validateStatus: function(status) {
                    return status;
                }
            })
            .then(response => {
                return response;
            }).catch(function(error) {
                return error;
            });
    },
    templates: function(data) {
        return axios({
                url: url + "dashboard/templates/",
                method: 'get',
                responseType: 'json',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data,
                validateStatus: function(status) {
                    return status;
                }
            })
            .then(response => {
                return response;
            }).catch(function(error) {
                return error;
            });
    },
    synonyms: function(data) {
        return axios.get(url + "dashboard/synonyms/", data)
            .then(response => {
                return response;
            }).catch(function(error) {
                return error;
            });
    },
    antonyms: function(data) {
        return axios.get(url + "dashboard/antonyms/", data)
            .then(response => {
                return response;
            }).catch(function(error) {
                return error;
            });
    },
    keywordtool: function(data) {
        return axios.get(url + "dashboard/keywordtool/", data)
            .then(response => {
                return response;
            }).catch(function(error) {
                return error;
            });
    },
}
