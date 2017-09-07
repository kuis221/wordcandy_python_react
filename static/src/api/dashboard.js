import axios from 'axios';

//export let url = 'https://wordcandy.io/v1/';
export let url = '/v1/';

exports.apiDashboard = {
    exportTemplates: function(data) {
        return axios({
                url: url + "dashboard/export/templates/",
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
    exportKeywords: function(data) {
        return axios({
                url: url + "dashboard/export/keywords/",
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
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.getItem('key')
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
    amazon: function(data) {
        console.log("Getting response......");
        return axios({
                url: url + "dashboard/amazon/",
                method: 'get',
                responseType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.getItem('key')
                },
                params: data,
                validateStatus: function(status) {
                    return status;
                }
            })
            .then(response => {
                console.log("Got respone////", response);
                return response;
            }).catch(function(error) {
                return error;
            });
    },
    newTemplates: function(data) {
        return axios({
                url: url + "dashboard/templates/",
                method: 'post',
                responseType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.getItem('key')
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
    trademarks: function(data) {
        return axios({
                url: url + "dashboard/trademarks/",
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
