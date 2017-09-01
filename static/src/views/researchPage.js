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

const categoryType = {
  0: 'mans',
  1: 'womens',
  2: 'all'
};

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
            keywords: '',
            filter: 'all'
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
        console.log("tags", tags, "keywords:", this.state.keywords);
        this.setState({tags: this.state.keywords, keywords: ''});
    }

    checkInput(e){
        var self = this;

        if (e.which == 13 || e.which == 188) {

            e.preventDefault();

            if(e.which == 13 && e.target.value == '' && self.state.tags != ''){
                self.search();
            }else {
                console.log(e.target.value);
                self.handleKeywords(e);
                self.addKeywords(e);
            }
            return false;
        }


    }

    imageFormatter(cell, row) {
        console.log("row:", row);
        return (
            <div>
                <Image src={cell} /><br />
                <a href={row.detail_page_url} target="_blank">{row.asin}</a>
            </div>
        );
    }

    asinFormatter(cell, row) {
        return (
            <a href={row.detail_page_url} target="_blank">{cell}</a>
        )
    }

    reviewsFormatter(cell, row) {
        if (cell[0]) {
            return (
                <a href={cell[1]} target="_blank">Look for reviews</a>
            )
        } else {
            return (
                <div>There are no reviews</div>
            )
        }
    }

    featuresFormatter(cell, row){
        if(cell){
            var count = 0;
            var features = cell.map((item) => {
                console.log("item", item);
                if(count >= 3){
                    return (
                        <li>{item}</li>
                    )
                }
                count++;
            });

            return (
                <ul>{features}</ul>
            )
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

    updateFilter(e){
        this.setState({filter: $(e.currentTarget).data('option')});

        var self = this;
        // Gotta wait for the state to actually change.
        setTimeout(function() {
            self.refs.typeCol.applyFilter(self.state.filter);
        }, 500);
    }

    formatCategory(cell, row, enumObject){
        return enumObject[cell];
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
                    <Nav>
                        <MenuItem href="/dashboard/">Dashboard</MenuItem>
                        <MenuItem href="/research-page/" className="active">Research</MenuItem>
                    </Nav>
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

                    <Row className="research-content">
                        <div className="fixed-subheader">


                                    <Panel>
                                        <br />
                                        <div className="container">
                                        <Row>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <FormControl type="text" placeholder="Enter keywords" onKeyDown={(e) => this.checkInput(e)} onChange={this.handleKeywords} value={this.state.keywords}/>
                                                    <Button bsStyle="primary" onClick={this.search} disabled={this.state.tags.length == 0 || !this.state.loadedResult}>
                                                            <i className="icon ion-ios-search"></i>
                                                        </Button>

                                                    <small className="hint">Press the comma or enter key to add keyword</small>
                                                </FormGroup>
                                            </Col>

                                            <Col md={5}>
                                                {this.state.tags.length > 0
                                                    ? <ul className="list-inline">
                                                            <li>
                                                                <span className="react-tagsinput-tag">{this.state.tags}
                                                                    <a className="react-tagsinput-remove" onClick={this.deleteKeywords}></a>
                                                                </span>
                                                            </li>
                                                        </ul>
                                                    : null}
                                            </Col>
                                            <Col md={4} className="text-right">
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

                                                    </li>
                                                </ul>
                                            </Col>
                                        </Row>
                                        </div>
                                    </Panel>


                        </div>
                        <div className="container">
                        <Col md={12} className="amazon-result">
                            <Loader loaded={this.state.loadedResult}>
                                <Panel>
                                    <div className="filter-buttons">
                                        <button onClick={(e) => this.updateFilter(e)} className={this.state.filter == '' ? 'btn btn-primary' : 'btn btn-outline'} data-option="">All</button>
                                        <button onClick={(e) => this.updateFilter(e)} className={this.state.filter == 'mans' ? 'btn btn-primary' : 'btn btn-outline'} data-option="mans">Mens</button>
                                        <button onClick={(e) => this.updateFilter(e)} className={this.state.filter == 'womens' ? 'btn btn-primary' : 'btn btn-outline'} data-option="womens">Womens</button>
                                    </div>
                                    <BootstrapTable data={this.state.products}>
                                        <TableHeaderColumn dataAlign='center' isKey dataField='small_image_url' dataFormat={this.imageFormatter}>Product</TableHeaderColumn>
                                        <TableHeaderColumn dataAlign='center' width="110" dataField='sales_rank' dataSort={true}>Sales Rank</TableHeaderColumn>
                                        <TableHeaderColumn dataAlign='center' dataField='monthly_sales_estimate' dataSort={true}>Monthly Sales Estimate</TableHeaderColumn>
                                        <TableHeaderColumn dataAlign='center' dataField='title'>Description</TableHeaderColumn>
                                        <TableHeaderColumn dataAlign='center' width="400" dataField='features' dataFormat={this.featuresFormatter}>Features</TableHeaderColumn>
                                        <TableHeaderColumn hidden ref='typeCol' dataAlign="center" dataField='type' filterFormatted dataFormat={this.formatCategory}
                                            formatExtraData={categoryType} filter={ {type: 'TextFilter', delay: 1000} }>Category</TableHeaderColumn>
                                    </BootstrapTable>
                                </Panel>
                            </Loader>
                        </Col>
                        </div>
                    </Row>

            </Grid>
        );
    }
}
