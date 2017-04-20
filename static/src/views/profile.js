import {
    Grid,
    Row,
    Col,
    Navbar,
    Panel,
    Checkbox,
    NavItem,
    Nav,
    Form,
    FormGroup,
    FormControl,
    Button,
    ControlLabel,
    Image
} from 'react-bootstrap';

import MaskedFormControl from 'react-bootstrap-maskedinput';
import Loader from 'react-loader';
import {Link, browserHistory} from 'react-router';
import React, {Component} from 'react';

import MixinAuth from '../mixins/auth';
import {apiProfiles} from '../api/profiles';

export default class Profile extends MixinAuth {

    constructor(props) {
        super(props);
        var user = JSON.parse(localStorage.getItem("user"));
        this.state = {
            user: user,
            activeName: false,
            loaded: true,
            email: user['email'],
            activeEmail: false,
            activePassword: false,
            activePlan: false,
            activePayment: false,
            username: user['username']
        };
        this.handleEmail = this.handleEmail.bind(this);
        this.cancelEmail = this.cancelEmail.bind(this);
        this.changeEmail = this.changeEmail.bind(this);

        this.handleUsername = this.handleUsername.bind(this);
        this.cancelUsername = this.cancelUsername.bind(this);
        this.changeUsername = this.changeUsername.bind(this);

        this.updateProfile = this.updateProfile.bind(this);
    }

    updateProfile() {
        var _ = this;
        _.setState({loaded: false});
        var data = {
            'username': this.state.username,
            'email': this.state.email
        };
        apiProfiles.updateUser(data).then(function(response) {
            _.setState({
              loaded: true,
            });
            localStorage.setItem('username', response['username']);
        });
    }

    cancelEmail(event) {
        var user = this.state.user;
        this.setState({activeEmail: false, email: user.email});
    }

    changeEmail(event) {
        var user = this.state.user;
        user.email = this.state.email;
        this.setState({activeEmail: false, user: user});
    }

    cancelUsername(event) {
        var user = this.state.user;
        this.setState({activeName: false, username: user.username});
    }

    changeUsername(event) {
        var user = this.state.user;
        user.username = this.state.username;
        this.setState({activeName: false, user: user});
    }

    handleEmail(event) {
        this.setState({email: event.target.value});
    }

    handleUsername(event) {
        this.setState({username: event.target.value});
    }

    render() {
        return (
            <Grid className="profile-page" fluid={true}>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to="/dashboard">WORDCANDY.IO</Link>
                            <span>{' '}
                                - {' '}KEYWORD APP</span>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav pullRight>
                        <NavItem href="/profile" className="profile-header">
                            <ul className="list-inline">
                                <li><Image width={'20px'} height={'20px'} src="/static/images/profile/avatar.png"/></li>
                                <li>{this.state.username}</li>
                                <li>
                                    <i className="icon ion-chevron-down"></i>
                                </li>
                            </ul>
                        </NavItem>
                    </Nav>
                </Navbar>
                <Row>
                    <Col md={2}></Col>
                    <Col md={8}>
                        <Panel className="profile-block">
                            <Row>
                                <Col md={3} className="profile-title">
                                    Information
                                </Col>
                                <Col md={9}>
                                    <Row className="border-bottom">
                                        <Col md={3}>
                                            User Name
                                        </Col>
                                        <Col md={7}>
                                            {this.state.activeName
                                                ? <div>
                                                        <FormGroup>
                                                            <FormControl type="text" placeholder="FirstName LastName" onChange={this.handleUsername} value={this.state.username}/>
                                                        </FormGroup>
                                                        <FormGroup className="text-right">
                                                            <Button disabled={this.state.username == ''} className="primary" onClick={this.changeUsername}>
                                                                Change Name
                                                            </Button>
                                                        </FormGroup>
                                                    </div>
                                                : null}
                                            {this.state.activeName == false
                                                ? <div>
                                                        <b>{this.state.username}</b>
                                                    </div>
                                                : null}
                                        </Col>
                                        <Col md={2} className="text-right">
                                            {this.state.activeName
                                                ? <a href="#" onClick={this.cancelUsername}>Cancel</a>
                                                : null}
                                            {this.state.activeName == false
                                                ? <a href="#" onClick={() => this.setState({activeName: true})}>Change</a>
                                                : null}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={3}></Col>
                                <Col md={9}>
                                    <Row className="border-bottom">
                                        <Col md={3}>
                                            Email
                                        </Col>
                                        <Col md={7}>
                                            {this.state.activeEmail
                                                ? <div>
                                                        <FormGroup>
                                                            <FormControl type="email" placeholder="example@mail.com" onChange={this.handleEmail} value={this.state.email}/>
                                                        </FormGroup>
                                                        <FormGroup className="text-right">
                                                            <Button disabled={this.state.email == ''} className="primary" onClick={this.changeEmail}>
                                                                Change Email
                                                            </Button>
                                                        </FormGroup>
                                                    </div>
                                                : null}
                                            {this.state.activeEmail == false
                                                ? <div>
                                                        <div>
                                                            <b>{this.state.email}</b>
                                                        </div>
                                                        <div>
                                                            <Checkbox disabled inline>
                                                                Send me news and notifications
                                                            </Checkbox>
                                                        </div>
                                                    </div>
                                                : null}
                                        </Col>
                                        <Col md={2} className="text-right">
                                            {this.state.activeEmail
                                                ? <a href="#" onClick={this.cancelEmail}>Cancel</a>
                                                : null}
                                            {this.state.activeEmail == false
                                                ? <a href="#" onClick={() => this.setState({activeEmail: true})}>Change</a>
                                                : null}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={3}></Col>
                                <Col md={9}>

                                    <Row>
                                        <Col md={3}>
                                            Password
                                        </Col>
                                        <Col md={7}>
                                            {this.state.activePassword
                                                ? <div>
                                                        <FormGroup>
                                                            <FormControl type="email" placeholder="Old password"/>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <FormControl type="email" placeholder="New password"/>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <FormControl type="email" placeholder="New password repeat"/>
                                                        </FormGroup>
                                                        <FormGroup className="text-right">
                                                            <Button disabled className="primary" onClick={() => this.setState({activePassword: false})}>
                                                                Change password
                                                            </Button>
                                                        </FormGroup>
                                                    </div>
                                                : null}
                                            {this.state.activePassword == false
                                                ? <div className="points">
                                                        <b>
                                                            <i className="icon ion-record"></i>
                                                            <i className="icon ion-record"></i>
                                                            <i className="icon ion-record"></i>
                                                            <i className="icon ion-record"></i>
                                                            <i className="icon ion-record"></i>
                                                            <i className="icon ion-record"></i>
                                                            <i className="icon ion-record"></i>
                                                            <i className="icon ion-record"></i>
                                                        </b>
                                                    </div>
                                                : null}
                                        </Col>
                                        <Col md={2} className="text-right">
                                            {this.state.activePassword
                                                ? <a href="#" onClick={() => this.setState({activePassword: false})}>Cancel</a>
                                                : null}
                                            {this.state.activePassword == false
                                                ? <a href="#" onClick={() => this.setState({activePassword: true})}>Change</a>
                                                : null}
                                        </Col>
                                    </Row>

                                </Col>
                            </Row>
                            <Row className="border-top">
                                <Col md={3} className="profile-title">
                                    Subscription
                                </Col>
                                <Col md={9}>
                                    <Row className="border-bottom">
                                        <Col md={3}>
                                            Current Plan
                                        </Col>
                                        <Col md={7}>
                                            {this.state.activePlan == false
                                                ? <div>
                                                        <b>VIP</b>
                                                    </div>
                                                : null}
                                            {this.state.activePlan
                                                ? <div>
                                                        <FormGroup controlId="formControlsSelect">
                                                            <FormControl componentClass="select" placeholder="Free">
                                                                <option value="select">VIP</option>
                                                            </FormControl>
                                                        </FormGroup>
                                                        <FormGroup className="text-right">
                                                            <Button className="primary" onClick={() => this.setState({activePlan: false})}>
                                                                Change plan
                                                            </Button>
                                                        </FormGroup>
                                                    </div>
                                                : null}
                                        </Col>
                                        <Col md={2} className="text-right">
                                            {this.state.activePlan
                                                ? <a href="#" onClick={() => this.setState({activePlan: false})}>Cancel</a>
                                                : null}
                                            {this.state.activePlan == false
                                                ? <a href="#" onClick={() => this.setState({activePlan: true})}>Change</a>
                                                : null}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={3}></Col>
                                <Col md={9}>
                                    <Row>
                                        <Col md={3}>
                                            Payment
                                        </Col>
                                        <Col md={7}>
                                            {this.state.activePayment == false
                                                ? <div>
                                                        <b>Master Card **** **** **** ****</b>
                                                    </div>
                                                : null}
                                            {this.state.activePayment
                                                ? <div>
                                                        <FormGroup>
                                                            <MaskedFormControl type='text' name='payment' mask='1111-1111-1111-1111'/>
                                                        </FormGroup>
                                                        <FormGroup className="text-right">
                                                            <Button disabled className="primary" onClick={() => this.setState({activePayment: false})}>
                                                                Change number
                                                            </Button>
                                                        </FormGroup>
                                                    </div>
                                                : null}
                                        </Col>
                                        <Col md={2} className="text-right">
                                            {this.state.activePayment
                                                ? <a href="#" onClick={() => this.setState({activePayment: false})}>Cancel</a>
                                                : null}
                                            {this.state.activePayment == false
                                                ? <a href="#" onClick={() => this.setState({activePayment: true})}>Change</a>
                                                : null}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="border-top">
                                <Col md={3} className="profile-title">
                                    Connect Accounts
                                </Col>
                                <Col md={9}>
                                    <Row>
                                        <Col md={4}>
                                            <Panel className="auth-block">
                                                <ul className="list-inline">
                                                    <li><Image src="/static/images/profile/dropbox.png" width={'20px'} height={'20px'}/></li>
                                                    <li className="dropbox">Dropbox</li>
                                                </ul>
                                                <div>Connect to Dropbox</div>
                                            </Panel>
                                        </Col>
                                        <Col md={4}>
                                            <Panel className="auth-block">
                                                <ul className="list-inline">
                                                    <li><Image src="/static/images/profile/google.png" width={'20px'} height={'20px'}/></li>
                                                    <li className="google">Google</li>
                                                </ul>
                                                <div>Connect to Google</div>
                                            </Panel>
                                        </Col>
                                        <Col md={6}></Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="border-top">
                                <Col md={3} className="profile-title">
                                    Add Team Member
                                </Col>
                                <Col md={9}>
                                    <Row>
                                        <Col md={12}>
                                            <Form inline>
                                                <FormGroup style={{
                                                    'width': '85%',
                                                    'padding-right': '10px'
                                                }}>
                                                    <FormControl style={{
                                                        'width': '100%'
                                                    }} type="email" placeholder="example@mail.com"/>
                                                </FormGroup>
                                                <FormGroup style={{
                                                    'width': '15%'
                                                }}>
                                                    <Button className="primary" disabled>
                                                        <i className="icon ion-android-send"></i>
                                                        Invite
                                                    </Button>
                                                </FormGroup>
                                            </Form>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Panel>
                    </Col>
                    <Col md={2}></Col>
                </Row>
                <div id="footer">
                    <Row>
                        <Col md={2}></Col>
                        <Col md={4} className="text-left">
                            <Button className="back-button">
                                <Link to="/dashboard">
                                    <i className="icon ion-android-arrow-back"></i>
                                    Back
                                </Link>
                            </Button>
                        </Col>
                        <Col md={4} className="text-right">
                            <Loader loaded={this.state.loaded}>
                                <Button bsStyle="success" onClick={this.updateProfile}>
                                    <i className="icon ion-checkmark-circled"></i>
                                    Done
                                </Button>
                            </Loader>
                        </Col>
                        <Col md={2}></Col>
                    </Row>
                </div>
            </Grid>
        );
    }
}
