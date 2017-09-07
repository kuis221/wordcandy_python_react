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

export default class Synonyms extends MixinAuth {

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

    }

    render(){
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
                        <MenuItem href="/research-page/">Research</MenuItem>
                        <MenuItem href="/synonyms-suggestions/" className="active">Synonym Suggestions</MenuItem>
                    </Nav>
                    <Nav pullRight>
                        <NavDropdown title={this.state.username} id="basic-nav-dropdown">
                            <MenuItem href="/dashboard/">Dashboard</MenuItem>
                            <MenuItem href="/profile/">Settings</MenuItem>
                            <MenuItem href="/research-page/">Research Page</MenuItem>
                            <MenuItem divider/>
                            <MenuItem href="/">Exit</MenuItem>
                        </NavDropdown>
                    </Nav>
                </Navbar>

                    <Row className="research-content">
                        <div className="fixed-subheader unfixed">


                                    <Panel header="Synonym Suggestions">
                                        <br />
                                        <div className="container">
                                        <Row>
                                            <Col md={5}>
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

                                            <Col md={4} className="text-right">
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
                            <Panel header="Amazon Auto Suggest + Google Search Traffic">
                            <Loader loaded={this.state.loadedKeywords}>
                                    {this.state.tags.length == 0
                                        ? <div className="text-center">Use different keywords.</div>
                                        : null}
                                    {this.state.tags.length > 0
                                        ? <div className="suggestions">
                                                <Tabs activeKey={this.state.suggestIndex} animation={false} onSelect={this.handleSuggests}>
                                                    {this.state.keywords.map(function(keyword, i) {
                                                        return <Tab eventKey={i} title={this.state.keywordsTitle[i]}>
                                                            {this.state.keywords[i].map(function(item, j) {
                                                                return <Row>
                                                                    <Col md={8}>
                                                                        <button className="ion-plus plus-button" onClick={this.addWord} data-word={item.name}></button>
                                                                        <span draggable='true' className={(item.trademark ? 'btn-trademark' : 'btn-container')} onDragStart={this.dragWordStart} style={{
                                                                            cursor: 'move'
                                                                        }} data-word={item.name}>{item.name}</span>
                                                                    </Col>
                                                                    <Col md={4} className="text-right">
                                                                        <span className="volume">{item.volume}</span>
                                                                    </Col>
                                                                </Row>
                                                            }, this)}
                                                        </Tab>
                                                    }, this)}
                                                </Tabs>
                                            </div>
                                        : null}
                                </Loader>
                            </Panel>
                        </div>
                    </Row>

            </Grid>
        )
    }
}