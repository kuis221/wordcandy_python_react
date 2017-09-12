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
            filter: 'all',
            range: ''
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

    checkInput(e){
        var self = this;

        if (e.which == 13 || e.which == 188 || e.which == 9) {

            e.preventDefault();

            if(e.which == 13 && e.target.value == '' && self.state.tags != ''){
                self.search();
            }else {
                self.handleKeywords(e);
                self.addKeywords(e);
            }
            return false;
        }


    }

    imageFormatter(cell, row) {
        return (
            <div><a href={row.detail_page_url} target="_blank">
                <Image src={cell} className="full-width-image"/><br />
                {row.asin}</a>
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
        apiDashboard.amazon({'tags': _.state.tags, 'range': _.state.range}).then(function(response) {
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

    updateRange(e){
        this.setState({range: $(e.currentTarget).val()});
        console.log(this.state.range);
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
                        <MenuItem href="/keyword-suggestions/">Keywords</MenuItem>

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
                        <div className="fixed-subheader unfixed">


                                    <Panel header="Search Amazon">
                                        <br />
                                        <div className="container">
                                        <Row>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <label>Enter Keywords</label>
                                                    <FormControl type="text" placeholder="Enter keywords" onKeyDown={(e) => this.checkInput(e)} onChange={this.handleKeywords} value={this.state.keywords}/>


                                                    <small className="hint">Press the comma or enter key to add keyword.  Press enter again to search.</small>
                                                </FormGroup>
                                            </Col>

                                            <Col md={3}>
                                                <label>Keywords</label>
                                                {this.state.tags.length > 0
                                                    ? <ul className="list-inline">
                                                            <li>
                                                                <span className="react-tagsinput-tag">{this.state.tags}
                                                                    <a className="react-tagsinput-remove" onClick={this.deleteKeywords}></a>
                                                                </span>
                                                            </li>
                                                        </ul>
                                                    : <span className="hint"><br />No keywords</span>}
                                                    <ul className="list-inline tag-actions text-right">
                                                    <li>
                                                        <a disabled={this.state.tags.length == 0} className="reset-keywords btn btn-default hide" onClick={this.deleteKeywords}>
                                                            <i className="icon ion-backspace"></i>
                                                            Clear All
                                                        </a>
                                                    </li>

                                                </ul>
                                            </Col>
                                            <Col md={3} className="">
                                                <label for="range">Search by Sales Rank</label><br />
                                                <input className="form-check-input" checked={this.state.range == ''} onChange={(e) => this.updateRange(e)} type="radio" name="range" value="" /> Any<br />
                                                <input className="form-check-input" checked={this.state.range == 'low'} onChange={(e) => this.updateRange(e)} type="radio" name="range" value="low" /> 1 - 100,000<br />
                                                <input className="form-check-input" checked={this.state.range == 'high'} onChange={(e) => this.updateRange(e)}  type="radio" name="range" value="high" /> 100,000+<br />

                                            </Col>
                                            <Col md={3} className="text-right">
                                                <br />
                                                <Button bsStyle="primary" onClick={this.search} disabled={this.state.tags.length == 0 || !this.state.loadedResult}>
                                                            <i className="icon ion-ios-search"></i> Search
                                                        </Button>
                                            </Col>
                                        </Row>
                                        </div>
                                    </Panel>


                        </div>
                        <div className="container">
                        <Col md={12} className="amazon-result">
                            <Loader loaded={this.state.loadedResult}>
                                <Panel header="Results">
                                    <div className="filter-buttons">
                                        <button onClick={(e) => this.updateFilter(e)} className={this.state.filter == '' ? 'btn btn-primary' : 'btn btn-default'} data-option="">All</button>
                                        <button onClick={(e) => this.updateFilter(e)} className={this.state.filter == 'mans' ? 'btn btn-primary' : 'btn btn-default'} data-option="mans">Mens</button>
                                        <button onClick={(e) => this.updateFilter(e)} className={this.state.filter == 'womens' ? 'btn btn-primary' : 'btn btn-default'} data-option="womens">Womens</button>
                                    </div>
                                    <BootstrapTable data={this.state.products} tableBodyClass="table table-striped">
                                        <TableHeaderColumn width="200" dataAlign='center' isKey dataField='small_image_url' dataFormat={this.imageFormatter}>Product</TableHeaderColumn>
                                        <TableHeaderColumn dataAlign='center' width="110" dataField='sales_rank' dataSort={true}>Sales Rank</TableHeaderColumn>
                                        <TableHeaderColumn dataAlign='center' dataField='monthly_sales_estimate' dataSort={true}>Monthly Sales Estimate</TableHeaderColumn>
                                        <TableHeaderColumn dataAlign='left' dataField='title'>Description</TableHeaderColumn>
                                        <TableHeaderColumn dataAlign='left' width="400" dataField='features' dataFormat={this.featuresFormatter}>Features</TableHeaderColumn>
                                        <TableHeaderColumn hidden ref='typeCol' dataAlign="left" dataField='type' filterFormatted dataFormat={this.formatCategory}
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
