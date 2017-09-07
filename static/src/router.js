import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link, browserHistory} from 'react-router';
import SignUp from './views/signUp';
import SignIn from './views/signIn';
import Dashboard from './views/dashboard';
import ResearchPage from './views/researchPage';
import Landing from './views/landing';
import Profile from './views/profile';
import Synonyms from './views/synonyms.js';
import ResetPassword from './views/resetPassword';

function run() {
    ReactDOM.render((
        <Router history={browserHistory}>
            <Route path="/" component={Landing}/>
            <Route path="/dashboard" component={Dashboard}/>
            <Route path="/research-page" component={ResearchPage}/>
            <Route path="/sign-up" component={SignUp}/>
            <Route path="/profile" component={Profile}/>
            <Route path="/sign-in" component={SignIn}/>
            <Route path="/reset/:code" component={ResetPassword}/>
            <Route path="/synonyms-suggestions" component={Synonyms} />
        </Router>
    ), document.getElementById('app'));
}

const loadedStates = ['complete', 'loaded', 'interactive'];

if (loadedStates.includes(document.readyState) && document.body) {
    run();
} else {
    window.addEventListener('DOMContentLoaded', run, false);
}
