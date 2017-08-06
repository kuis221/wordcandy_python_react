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
            loadedResult: true,
            tags: '',
            keywords: ''
        };
        this.search = this.search.bind(this);
        this.handleKeywords = this.handleKeywords.bind(this);
        this.addKeywords = this.addKeywords.bind(this);
        this.deleteKeywords = this.deleteKeywords.bind(this);
    }

    componentWillMount() {
      document.body.style.backgroundColor = "#454656";
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

    handleKeywords(event) {
      this.setState({keywords: event.target.value});
    }

    deleteKeywords() {
      this.setState({tags: ''});
    }

    addKeywords(event) {
      var tags = this.state.tags;
      this.setState({tags: this.state.keywords, keywords: ''});
    }

    imageFormatter(cell, row) {
        return <Image src={cell}/>;
    }

    asinFormatter(cell, row) {
      return(<a href={row.detail_page_url} target="_blank">{cell}</a>)
    }

    reviewsFormatter(cell, row) {
      if (cell[0]) {
        return(<a href={cell[1]} target="_blank">Look for reviews</a>)
      } else {
        return(<div>There are no reviews</div>)
      }
    }

    search() {
        var _ = this;
        _.setState({loadedResult: false});
        apiDashboard.amazon({'tags': _.state.tags}).then(function(response) {
            switch (response.status) {
                case 200:
                    _.setState({products: response.data['result'], loadedResult: true});
                    break;
                case 401:
                    browserHistory.push('/sign-in');
                    break;
                default:
                    _.setState({loadedResult: true});
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
                                            <FormControl type="text" placeholder="Enter keywords" onChange={this.handleKeywords} value={this.state.keywords} />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={7}>
                                        {this.state.tags.length > 0 ?
                                          <ul className="list-inline">
                                              <li>
                                                  <span className="react-tagsinput-tag">{this.state.tags}<a className="react-tagsinput-remove" onClick={this.deleteKeywords}></a>
                                                  </span>
                                              </li>
                                          </ul>
                                        : null}
                                    </Col>
                                    <Col md={5} className="text-right">
                                        <ul className="list-inline">
                                            <li>
                                              <a disabled={this.state.tags.length == 0} className="reset-keywords btn btn-outline" onClick={this.deleteKeywords}>
                                                <i className="icon ion-backspace"></i>
                                                Clear All
                                              </a>
                                            </li>
                                            <li>
                                                <Button bsStyle="primary" disabled={this.state.tags.length > 0} onClick={this.addKeywords}>
                                                    <i className="icon ion-ios-plus-outline"></i>
                                                    Add keywords
                                                </Button>
                                            </li>
                                            <li>
                                                <Loader loaded={this.state.loadedResult}>
                                                  <Button bsStyle="primary" onClick={this.search} disabled={this.state.tags.length == 0}>
                                                      <i className="icon ion-ios-search"></i>
                                                      Search
                                                  </Button>
                                                </Loader>
                                            </li>
                                        </ul>
                                    </Col>
                                </Row>
                            </Panel>
                        </Col>
                        <Col md={12} className="amazon-result">
                            <Loader loaded={this.state.loadedResult}>
                                <Panel>
                                    <BootstrapTable data={this.state.products} height="400px" scrollTop={'Bottom'} pagination>
                                        <TableHeaderColumn dataAlign='center' isKey dataField='small_image_url' dataFormat={this.imageFormatter}>Product</TableHeaderColumn>
                                        <TableHeaderColumn dataAlign='center' dataField='asin' dataFormat={this.asinFormatter}>ASIN</TableHeaderColumn>
                                        <TableHeaderColumn dataAlign='center' dataField='sales_rank' dataSort={true}>Sales Rank</TableHeaderColumn>
                                        <TableHeaderColumn dataAlign='center' dataField='monthly_sales_estimate' dataSort={true}>Monthly Sales Estimate</TableHeaderColumn>
                                        <TableHeaderColumn dataAlign='center' dataField='title'>Description</TableHeaderColumn>
                                        <TableHeaderColumn dataAlign='center' dataField='reviews' dataFormat={this.reviewsFormatter}>Reviews</TableHeaderColumn>
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
