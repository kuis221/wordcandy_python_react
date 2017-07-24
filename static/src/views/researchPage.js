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
    NavDropdown,
    MenuItem,
    Table
} from 'react-bootstrap';

import {Link, browserHistory} from 'react-router';
import React, {Component} from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Loader from 'react-loader';

import MixinAuth from '../mixins/auth';
import {apiProfiles} from '../api/profiles';
import {apiDashboard} from '../api/dashboard';

function imageFormatter(cell, row) {
    return <Image src={cell}/>;
}

export default class ResearchPage extends MixinAuth {

    constructor(props) {
        super(props);
        if (localStorage.getItem("user") == null) {
            browserHistory.push('/sign-in');
        }
        var user = JSON.parse(localStorage.getItem("user"));

        this.state = {
            user: user,
            username: user.username,
            products: [],
            loadedResult: true
        };
        this.search = this.search.bind(this);
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

    search() {
        var _ = this;
        _.setState({loadedResult: false});
        apiDashboard.amazon({'tags': 'iphone'}).then(function(response) {
            switch (response.status) {
                case 200:
                    _.setState({products: response.data['result'], loadedResult: true});
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
                            <Panel header="Add your keywords">
                                <Row>
                                    <Col md={12}>
                                        <FormGroup>
                                            <FormControl type="text" value="" placeholder="Enter keywords"/>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={8}>
                                        <ul className="list-inline">
                                            <li>
                                                <span className="react-tagsinput-tag">iphone<a className="react-tagsinput-remove"></a>
                                                </span>
                                            </li>
                                            <li>
                                                <span className="react-tagsinput-tag">apple<a className="react-tagsinput-remove"></a>
                                                </span>
                                            </li>
                                        </ul>
                                    </Col>
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
                                                <Button bsStyle="primary" onClick={this.search} disabled={!this.state.loadedResult}>
                                                    <i className="icon ion-ios-search"></i>
                                                    Search
                                                </Button>
                                            </li>
                                        </ul>
                                    </Col>
                                </Row>
                            </Panel>
                        </Col>
                        <Col md={12} className="amazon-result">
                            <Loader loaded={this.state.loadedResult}>
                                <Panel>
                                    <BootstrapTable data={this.state.products} height='270' scrollTop={'Bottom'} pagination>
                                        <TableHeaderColumn dataAlign='center' isKey dataField='small_image_url' dataFormat={imageFormatter}>Product</TableHeaderColumn>
                                        <TableHeaderColumn dataAlign='center' dataField='asin'>ASIN</TableHeaderColumn>
                                        <TableHeaderColumn dataAlign='center' dataField='sales_rank' dataSort={true}>Sales Rank</TableHeaderColumn>
                                        <TableHeaderColumn dataAlign='center' dataField='sales_estimate' dataSort={true}>Daily Sales Estimate</TableHeaderColumn>
                                        <TableHeaderColumn dataAlign='center' dataField='features'>Description</TableHeaderColumn>
                                        <TableHeaderColumn dataAlign='center' dataField='google_traffic' dataSort={true}>Google Traffic</TableHeaderColumn>
                                    </BootstrapTable>
                                </Panel>
                            </Loader>
                        </Col>
                    </Row>
                </div>
            </Grid>
        );
    }
}
