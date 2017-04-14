import {
    Grid,
    Row,
    Col,
    Navbar,
    Panel,
    Checkbox,
    Form,
    FormGroup,
    FormControl,
    Button,
    ControlLabel,
    Image
} from 'react-bootstrap';

import {Link, browserHistory} from 'react-router';
import React, {Component} from 'react';

export default class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Grid className="profile-page" fluid={true}>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="#">WORDCANDY.IO</a>
                            <span>{' '}
                                - {' '}KEYWORD APP</span>
                        </Navbar.Brand>
                    </Navbar.Header>
                </Navbar>
                <Row>
                    <Col md={2}></Col>
                    <Col md={8}>
                        <Panel>
                            <Row>
                                <Col md={3}>
                                    Information
                                </Col>
                                <Col md={9}>
                                    <Row className="border-bottom">
                                        <Col md={3}>
                                            User Name
                                        </Col>
                                        <Col md={7}>
                                            <div>
                                                <b>Jonathan Andreson</b>
                                            </div>
                                        </Col>
                                        <Col md={2} className="text-right">
                                            <a href="#">Cancel</a>
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
                                            <div>
                                                <b>JonathanAndreson@gmail.com</b>
                                            </div>
                                            <div>
                                                <Checkbox inline>
                                                    Send me news and notifications
                                                </Checkbox>
                                            </div>
                                        </Col>
                                        <Col md={2} className="text-right">
                                            <a href="#">Cancel</a>
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
                                            <div className="points">
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
                                        </Col>
                                        <Col md={2} className="text-right">
                                            <a href="#">Cancel</a>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="border-top">
                                <Col md={3}>
                                    Subscription
                                </Col>
                                <Col md={9}>
                                    <Row className="border-bottom">
                                        <Col md={3}>
                                            Current Plan
                                        </Col>
                                        <Col md={7}>
                                            <div>
                                                <b>Profesional Seller</b>
                                            </div>
                                        </Col>
                                        <Col md={2} className="text-right">
                                            <a href="#">Cancel</a>
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
                                            <div>
                                                <b>Master Card **** **** **** 7579</b>
                                            </div>
                                        </Col>
                                        <Col md={2} className="text-right">
                                            <a href="#">Cancel</a>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="border-top">
                                <Col md={3}>
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
                                <Col md={3}>
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
                                                    }} type="text" type="email" placeholder="example@mail.com"/>
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
                        <Col md={8} className="text-right">
                            <Button bsStyle="success" onClick={this.exportData}>
                                <i className="icon ion-checkmark-circled"></i>
                                Done
                            </Button>
                        </Col>
                        <Col md={2}></Col>
                    </Row>
                </div>
            </Grid>
        );
    }
}
