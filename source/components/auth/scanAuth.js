/*

  DECLARES REGISTRATION CONTROL FLOW

*/
import React, { Component } from 'react';
import qs from 'qs';
// Components
import styles from './scanAuth.scss';
import axios from 'axios';
import queryString from 'query-string';

(function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    (i[r] =
        i[r] ||
        function() {
            (i[r].q = i[r].q || []).push(arguments);
        }),
        (i[r].l = 1 * new Date());
    (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
})(
    window,
    document,
    'script',
    'https://www.google-analytics.com/analytics.js',
    'ga'
);
ga('create', 'UA-46010489-2', {
    cookieDomain: 'hackillinois.org'
});

// This route is hit on redirect from /auth/google/ in the scanning workflow
export default class ScanAuth extends Component {
    constructor(props) {
        super(props);
        this.apiUrl = 'https://api.reflectionsprojections.org';
    }

    componentDidMount() {
        const values = queryString.parse(this.props.location.search);
        const authorizationCode = values.code;
        sessionStorage.setItem('Authorization-Code', authorizationCode);
        const HTTP_STATUS_OK = 200;

        authorizationCode.concat('#');

        const body = { code: authorizationCode };
        const url =
            this.apiUrl +
            '/auth/code/google/?redirect_uri=https://reflectionsprojections.org/scanAuth';
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Origin: '*' },
            data: body,
            url
        };
        axios(options)
            .then(function(response) {
                if (HTTP_STATUS_OK === response.status) {
                    let apiJwt = response.data.token;
                    sessionStorage.setItem('Authorization', apiJwt);

                    window.location =
                        'acmrp://auth?token=' + apiJwt;
                }
            })
            .catch(function(error) {
                console.log(error.response);
            });
        }

    render() {
        return <div className="background" />;
    }
}