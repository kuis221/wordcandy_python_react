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
    Image,
    NavDropdown,
    MenuItem
} from 'react-bootstrap';

import MaskedFormControl from 'react-bootstrap-maskedinput';
import Loader from 'react-loader';
import {browserHistory, Link} from 'react-router';
import React, {Component} from 'react';

import MixinAuth from '../mixins/auth';
import {apiProfiles} from '../api/profiles';



export default class Profile extends MixinAuth {

    constructor(props) {
        super(props);
        if (localStorage.getItem("user") == null) {
            browserHistory.push('/sign-in');
        }
        var user = JSON.parse(localStorage.getItem("user"));
        var vip = false;
        try {
            if (user.vip) {
                vip = true;
            }
        } catch (e) {}
        this.state = {
            user: user,
            vip: vip,
            activeName: false,
            loaded: true,
            user: user,
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

    componentWillMount() {
        document.body.style.backgroundColor = "#454656";
        let access_token = '';
        let code = window.location.href.indexOf('code=4') > -1;

        if(code){
            let pre_access_token = window.location.href.split('/');
            access_token = pre_access_token[pre_access_token.length - 1];
            console.log("Access token is", access_token);
        }
    }

    updateProfile() {
        var _ = this;
        _.setState({loaded: false});
        var data = {
            'username': this.state.username,
            'email': this.state.email
        };
        apiProfiles.updateUser(data).then(function(response) {
            _.setState({loaded: true});
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

    handleGoogleAuth(e){
        $.ajax({
            url: '/v1/dashboard/google_auth',
            type: 'GET',
            dataType: 'json',
            success: function(res){
                console.log(res);
                let win = window.open(res.auth, '_blank');
                win.focus();
            }
        });
    }

    render() {
        return (
            <Grid className="profile-page" fluid={true}>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link className="logo" to="/dashboard/"><Image style={{
                width: '170px'
            }} src="/static/images/logo.png"/></Link>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav>
                        <MenuItem href="/dashboard/">Dashboard</MenuItem>
                        <MenuItem href="/research-page/">Research</MenuItem>
                        <MenuItem href="/keyword-suggestions/">Keywords</MenuItem>

                    </Nav>
                    <Nav pullRight>
                        <NavDropdown title={this.state.username} id="basic-nav-dropdown">
                            <MenuItem href="/dashboard/">Dashboard</MenuItem>
                            <MenuItem disabled>Settings</MenuItem>
                            <MenuItem href="/research-page/">Research page</MenuItem>
                            <MenuItem divider/>
                            <MenuItem href="/">Exit</MenuItem>
                        </NavDropdown>
                    </Nav>
                </Navbar>
                <div className="dashboard-content">
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
                                        <Row>
                                            <Col md={3}>
                                                Current Plan
                                            </Col>
                                            <Col md={7}>
                                                {this.state.vip
                                                    ? <ul className="list-inline">
                                                            <li><Image width={'32px'} height={'32px'} src="/static/images/dashboard/vip.png"/></li>
                                                            <li>Founding LIFETIME Member</li>
                                                        </ul>
                                                    : null}
                                                {!this.state.vip
                                                    ? <ul className="list-inline">
                                                            <li>{this.state.user.plan}</li>
                                                        </ul>
                                                    : null}
                                            </Col>
                                            <Col md={2} className="text-right">
                                                {!this.state.vip
                                                    ? <a href="/payments/">Change</a>
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
                                                <Panel className="auth-block" onClick={(e) => this.handleGoogleAuth(e)}>
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
                </div>
                <Row id="footer">
                    <Col md={12}>
                        <Navbar>
                            <Nav>
                                <NavItem className="back-button" href="/dashboard">
                                    <i className="icon ion-android-arrow-back"></i>{' '}Back
                                </NavItem>
                            </Nav>

                            <Nav style={{
                                paddingRight: '20%'
                            }} pullRight>
                                <NavItem>
                                    <Loader loaded={this.state.loaded}>
                                        <Button bsStyle="success" onClick={this.updateProfile}>
                                            <i className="icon ion-checkmark-circled"></i>
                                            Done
                                        </Button>
                                    </Loader>
                                </NavItem>
                            </Nav>
                        </Navbar>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
