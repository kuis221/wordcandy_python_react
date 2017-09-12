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
    Table,
    Tabs
} from 'react-bootstrap';

import {Link, browserHistory} from 'react-router';
import React, {Component} from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Loader from 'react-loader';
import format from 'string-format';
import lodash from 'lodash';
import Toggle from 'react-toggle';
import CopyToClipboard from 'react-copy-to-clipboard';

import MixinAuth from '../mixins/auth';
import {apiProfiles} from '../api/profiles';
import {apiDashboard} from '../api/dashboard';

export default class KeywordsSuggestor extends MixinAuth {

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
            loadedKeywords: false,
            tags: [],
            filter: 'all',
            range: '',
            keywords: [],
            keywordsTitle: [],
            stats: [],
            keywords2: '',
            sortedKeywords: [],
            savedKeywords: [],
            csvKeywords: ''
        };

        this.handleKeywords = this.handleKeywords.bind(this);
        this.deleteKeywords = this.deleteKeywords.bind(this);
        this.addKeywords = this.addKeywords.bind(this);
        this.checkInput = this.checkInput.bind(this);
        this.keywordtool = this.keywordtool.bind(this);
        this.addWord = this.addWord.bind(this);
        this.removeWord = this.removeWord.bind(this);
        this.updateCsv = this.updateCsv.bind(this);
        this.copied = this.copied.bind(this);

    }

    handleKeywords(event) {

        this.setState({keywords2: [event.target.value]});
    }

    deleteKeywords() {
        this.setState({tags: ''});
    }

    addKeywords(event) {
        let tags = this.state.tags;
        tags.push(this.state.keywords2);
        this.setState({tags: tags, keywords2: '', keywords: tags});
    }

    checkInput(e){
        let self = this;

        if (e.which == 13 || e.which == 188 || e.which == 9) {

            e.preventDefault();

            if(e.which == 13 && e.target.value == '' && self.state.tags != ''){
                self.keywordtool(e, 0);
            }else {
                console.log("Trying to add keyword", self);
                self.handleKeywords(e);
                self.addKeywords(e);
            }

            return false;
        }


    }

    addWord(e){
        let word = $(e.currentTarget).data('word');
        let id = $(e.currentTarget).data('id');
        let keyword = this.state.stats[id];
        let currentlySaved = this.state.savedKeywords;

        currentlySaved.push(keyword);
        this.setState({savedKeywords: currentlySaved});
        this.updateCsv();

    }

    updateCsv(){
        let csv = '';
        for(let i = 0; i < this.state.savedKeywords.length; i++){
            console.log(i, "adding", this.state.savedKeywords[i].name);
            if(i == 0){
                csv = this.state.savedKeywords[i].name;
            }else{
                csv += ', ' + this.state.savedKeywords[i].name;
            }
        }
        console.log("csv is", csv);
        this.setState({csvKeywords: csv});
    }

    removeWord(e){
        let id = $(e.currentTarget).data('id');
        let current = this.state.savedKeywords;
        delete current[id];

        this.setState({savedKeywords: current});
        this.updateCsv();

    }

    copied(e){
        this.setState({copied: true});

        $('#copiedText').fadeIn('fast');

        setTimeout(function(){
            $('#copiedText').fadeOut('fast');
        }, 3000);
    }

     exportKeywords() {
        let _ = this;
        _.setState({loadedExport: false});
        let data = {
            'keywords': JSON.stringify(_.state.savedKeywords)
        };
        apiDashboard.exportKeywords(data).then(function(response) {
            _.setState({loadedExport: true});
            window.location = response.data['file'];
        });
        $('#exportedText').fadeIn('fast');

        setTimeout(function(){
            $('#exportedText').fadeOut('fast');
        }, 3000);

     }


    keywordtool(e, i) {
        let _ = this;
        let data = {
            'params': {
                'tags': _.state.tags[i][0],
                'format': 'json'
            }
        };

        console.log("data", data);
        apiDashboard.keywordtool(data).then(function(response) {
            console.log("RE:", response);
            let keywords = _.state.keywords;
            let sortKeywords = lodash.sortBy(response.data.keywords, 'volume').reverse();

            _.setState({sortedKeywords: sortKeywords});

            let stats = (_.state.stats).concat(response.data.keywords);
            stats = lodash.sortBy(stats, 'volume').reverse();
            _.setState({stats: stats});

            stats = _.state.stats;

            console.log(_.state);

            let words = '';
            for (let index = 0; index < _.state.stats.length; index++) {
                words += (index == 0
                    ? ''
                    : ',') + _.state.stats[index].name;
            }

            let data = {
                'words': words
            }

            apiDashboard.trademarks(data).then(function(response) {
                for (let j = 0; j < response.data.length; j++) {
                  if (response.data[j].count > 0) {
                      console.log("stats", j, stats[j]);
                    stats[j]['trademark'] = true
                  }
                }
                _.setState({stats: stats});
            });

            let keywordsTitle = _.state.keywordsTitle;

            keywordsTitle.push(_.state.tags[i]);
            _.setState({keywordsTitle: keywordsTitle});

            _.setState({loadedKeywords: true});
            _.setState({
                progress: Math.round(100 / (_.state.tags.length - i))
            });

            if (_.state.progress > 99) {
                setTimeout(function() {
                    _.setState({progressShow: false});
                }, 2000);
            }

            console.log(_.state.stats);

            i++;
            if (i < _.state.tags.length) {
                _.keywordtool(_, i);
            }

        });
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
                        <MenuItem href="/keyword-suggestions/" className="active">Keywords</MenuItem>
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


                                    <Panel header="Keyword Suggestions">
                                        <br />
                                        <div className="container">
                                        <Row>
                                            <Col md={5}>
                                                <FormGroup>
                                                    <label>Enter Keywords</label>
                                                    <FormControl type="text" placeholder="Enter keywords" onKeyDown={(e) => this.checkInput(e)} onChange={this.handleKeywords} value={this.state.keywords2}/>


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
                                                <Button bsStyle="primary" onClick={(e) => this.keywordtool(e, 0)} disabled={this.state.tags.length == 0 || !this.state.loadedResult}>
                                                            <i className="icon ion-ios-search"></i> Search
                                                        </Button>
                                            </Col>
                                        </Row>
                                        </div>
                                    </Panel>


                        </div>
                        <div className="container">
                            <Col md={12}>
                            <Panel header="Amazon Auto Suggest + Google Search Traffic">

                                <Loader loaded='true'>
                                    <Row>

                                    <Col md={6}>
                                        <h3>Available Keywords</h3>
                                    {this.state.stats.length == 0
                                        ? <div className="text-center">Use different keywords.</div>
                                        : null}
                                    {this.state.stats.length > 0
                                        ? <div className="suggestions">
                                            <table className="table table-striped">

                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th>Keyword</th>
                                                        <th>Popularity</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                            {this.state.stats.map(function(item, j) {
                                                                return <tr>
                                                                    <td width="50">
                                                                        <button className="ion-plus plus-button" onClick={(e) => this.addWord(e)} data-word={item.name} data-id={j}></button>

                                                                    </td>
                                                                    <td>
                                                                        <span draggable='true' className={(item.trademark ? 'btn-trademark' : 'btn-container')} onDragStart={this.dragWordStart} style={{
                                                                            cursor: 'move'
                                                                        }} data-word={item.name}>{item.name}</span>
                                                                    </td>
                                                                    <td>
                                                                        <span>{item.volume}</span>
                                                                    </td>
                                                                </tr>
                                                            }, this)}
                                                </tbody>
                                            </table>
                                            </div>
                                        : null}
                                    </Col>
                                    <Col md={6}>
                                        <h3>Saved Keywords</h3>

                                        {this.state.savedKeywords.length == 0
                                        ? <div className="text-center">Use different keywords.</div>
                                        : null}

                                        {this.state.savedKeywords.length > 0
                                        ? <div className="suggestions">
                                        <table className="table table-striped">

                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th>Keyword</th>
                                                        <th>Popularity</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="saved-keywords">
                                                {this.state.savedKeywords.map(function(item, j) {
                                                                return <tr>
                                                                    <td width="50">
                                                                        <button className="ion-minus minus-button" onClick={(e) => this.removeWord(e)} data-word={item.name} data-id={j}></button>

                                                                    </td>
                                                                    <td>
                                                                        <span draggable='true' className={(item.trademark ? 'btn-trademark' : 'btn-container')} onDragStart={this.dragWordStart} style={{
                                                                            cursor: 'move'
                                                                        }} data-word={item.name}>{item.name}</span>
                                                                    </td>
                                                                    <td>
                                                                        <span>{item.volume}</span>
                                                                    </td>
                                                                </tr>
                                                            }, this)}
                                                </tbody>
                                        </table>
                                        </div>
                                        : null}


                                    </Col>
                                    </Row>
                                </Loader>
                                <div className="bottom-actions text-right">

                                    <small id="copiedText" className="hint">Copied</small>
                                    <small id="exportedText" className="hint">Exported</small>

                                    &nbsp;
                                    <CopyToClipboard text={this.state.csvKeywords} onCopy={(e) => this.copied(e)}>
                                        <button className="btn btn-default">Copy</button>
                                                            </CopyToClipboard> &nbsp;
                                    <button className="btn btn-primary" onClick={(e) => this.exportKeywords(e)}>Export</button>

                                </div>
                            </Panel>
                            </Col>
                        </div>
                    </Row>

            </Grid>
        )
    }
}