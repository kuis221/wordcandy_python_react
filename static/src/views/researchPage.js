import {
    Grid,
    Row,
    Col,
    Nav,
    NavItem,
    Navbar,
    Panel,
    Image,
    Button,
    Form,
    FormGroup,
    ControlLabel,
    FormControl,
    InputGroup,
    OverlayTrigger,
    Popover,
    ButtonToolbar,
    ButtonGroup,
    Tabs,
    NavDropdown,
    MenuItem,
    Tab,
    ProgressBar
} from 'react-bootstrap';

import {Link, browserHistory} from 'react-router';
import React, {Component} from 'react';

import MixinAuth from '../mixins/auth';
import {apiProfiles} from '../api/profiles';

export default class ResearchPage extends MixinAuth {

    constructor(props) {
        super(props);
        if (localStorage.getItem("user") == null) {
            browserHistory.push('/sign-in');
        }
        var user = JSON.parse(localStorage.getItem("user"));

        this.state = {
            user: user,
            username: user.username
        };
    }

    componentDidMount() {
        var _ = this;
        apiProfiles.getUser().then(function(response) {
            switch (response.status) {
                case 200:
                    var user = response.data;
                    _.setState({vip: user.vip, active: user.active, print: user.count, user: user, username: user.username});
                    localStorage.setItem("user", JSON.stringify(response.data));
                    break;
                case 401:
                    browserHistory.push('/sign-in');
                    break;
            }

        }).catch(function(error) {});
    }

    render() {
        return (
            <Grid className="research-page" fluid={true}>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link className="logo" to="/dashboard/"><Image style={{
                width: '170px'
            }} src="/static/images/logo.png"/></Link>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav pullRight>
                        <NavDropdown title={this.state.username} id="basic-nav-dropdown">
                            <MenuItem href="/dashboard/">Dashboard</MenuItem>
                            <MenuItem href="/profile/">Settings</MenuItem>
                            <MenuItem disabled>Research Page</MenuItem>
                            <MenuItem divider/>
                            <MenuItem href="/">Exit</MenuItem>
                        </NavDropdown>
                    </Nav>
                </Navbar>
                <div className="container">
                    <Row className="research-content">
                        <Col md={12}>
                            <Panel header="Add your keywords" style={{
                                height: 150
                            }}>
                                <Row>
                                    <Col md={12}>
                                        <FormGroup>
                                            <FormControl type="text" value="" placeholder="Enter keywords"/>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={8}></Col>
                                    <Col md={4}>
                                        <ul className="list-inline">
                                            <li>
                                                <Button bsStyle="primary">
                                                    <i className="icon ion-ios-trash-outline"></i>
                                                    Clear All
                                                </Button>
                                            </li>
                                            <li>
                                                <Button bsStyle="primary">
                                                    <i className="icon ion-ios-plus-outline"></i>
                                                    Add keywords
                                                </Button>
                                            </li>
                                            <li>
                                                <Button bsStyle="primary">
                                                    <i className="icon ion-ios-search"></i>
                                                    Search
                                                </Button>
                                            </li>
                                        </ul>
                                    </Col>
                                </Row>
                            </Panel>
                        </Col>
                    </Row>
                </div>
            </Grid>
        );
    }
}
