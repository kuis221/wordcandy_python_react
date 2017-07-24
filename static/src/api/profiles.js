import axios from 'axios';

export let url = 'http://0.0.0.0:8000/v1/';

exports.apiProfiles = {
    signUp: function(data) {
        return axios({
                url: url + "registration/",
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
    signIn: function(data) {
        return axios({
                url: url + "login/",
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
    reset: function(data) {
        return axios({
                url: url + "password/reset/",
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
    getUser: function() {
        return axios({
                url: url + "dashboard/user/",
                method: 'get',
                responseType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.getItem('key')
                },
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
    updateUser: function(data) {
        return axios({
                url: url + "dashboard/user/",
                method: 'patch',
                responseType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.getItem('key')
                },
                data: data
            })
            .then(response => {
                return response.data;
            }).catch(function(error) {
                return error;
            });
    },
    resetConfirm: function(data) {
        return axios({
                url: url + "password/reset/confirm/",
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
    subscribe: function(data) {
        return axios({
                url: url + "dashboard/subscribe/",
                method: 'post',
                responseType: 'json',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            })
            .then(response => {
                return response.data;
            }).catch(function(error) {
                return error;
            });
    },
}
