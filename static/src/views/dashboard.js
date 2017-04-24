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
    FormControl
} from 'react-bootstrap';

import {Link, browserHistory} from 'react-router';
import React, {Component} from 'react';
import TagsInput from 'react-tagsinput';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import Loader from 'react-loader';
import format from 'string-format';
import lodash from 'lodash';

import MixinAuth from '../mixins/auth';
import {apiDashboard} from '../api/dashboard';
import {apiProfiles} from '../api/profiles';

export default class Dashboard extends MixinAuth {

    constructor(props) {
        super(props);
        this.state = {
            tags: [],
            similars: [],
            stats: [],
            shops: [],
            templates: [],
            template: [],
            activeTemplate: 0,
            activeShop: 0,
            loadedSimilars: true,
            loadedKeywords: true,
            imageBase64: '',
            loadedExport: true,
            username: localStorage.getItem('username'),
            thumbnail: '/static/images/dashboard/photo.png',
            url: 'http://www.wordcandy.io'
        };
        this.onUploadImage = this.onUploadImage.bind(this);
        this.calculate = this.calculate.bind(this);
        this.exportData = this.exportData.bind(this);
        this.handleShop = this.handleShop.bind(this);
        this.handleTemplate = this.handleTemplate.bind(this);
        this.reset = this.reset.bind(this);
        this.addWord = this.addWord.bind(this);
        this.handleTitle = this.handleTitle.bind(this);
        this.handleSecondDescription = this.handleSecondDescription.bind(this);
        this.handleFirstDescription = this.handleFirstDescription.bind(this);
    }

    reset() {
        this.setState({tags: [], similars:[], stats: [], thumbnail: '/static/images/dashboard/photo.png'});
    }

    addWord(event) {
        var template = this.state.template;
        template.title = template.title.replace('{}', event.target.getAttribute('data-word'));
        template.first_description = template.first_description.replace('{}', event.target.getAttribute('data-word'));
        template.second_description = template.second_description.replace('{}', event.target.getAttribute('data-word'));

        this.setState({template: template});
    }

    handleTitle(event) {
        var template = this.state.template;
        template.title = event.target.value
        this.setState({template: template});
    }

    handleSecondDescription(event) {
        var template = this.state.template;
        template.second_description = event.target.value
        this.setState({template: template});
    }

    handleFirstDescription(event) {
        var template = this.state.template;
        template.first_description = event.target.value
        this.setState({template: template});
    }

    handleShop(index) {
        this.setState({activeShop: index, templates: this.state.shops[index].templates, activeTemplate: 0, template: this.state.shops[index].templates[0]})
    }

    handleTemplate(event) {
        this.setState({
            activeTemplate: event.target.getAttribute('data-id'),
            template: this.state.templates[event.target.getAttribute('data-id')]
        });
    }

    handleChangeTags(tags) {
        this.setState({tags})
    }

    componentDidMount() {
        var _ = this;
        apiProfiles.getUser().then(function(response) {
            switch (response.status) {
                case 200:
                    localStorage.setItem("user", JSON.stringify(response.data));
                    break;
                case 401:
                    browserHistory.push('/sign-in');
                    break;
            }

        }).catch(function(error) {});

        apiDashboard.templates().then(function(response) {
            _.setState({shops: response.data, templates: response.data[0].templates, template: response.data[0].templates[0]});
        }).catch(function(error) {});

    }

    onUploadImage(files) {
        var _ = this;
        var file = files[0]
        const reader = new FileReader();
        reader.onload = (event) => {
            _.setState({imageBase64: event.target.result})
        };
        reader.readAsDataURL(file);

        this.setState({thumbnail: files[0]['preview']
        });
    }

    exportData() {
        var _ = this;
        _.setState({loadedExport: false});
        var data = {
            'product_name': this.state.template.title,
            'first_description': this.state.template.first_description,
            'second_description': this.state.template.second_description,
            'keywords': this.state.tags.toString()
        }
        if (this.state.imageBase64.length > 0) {
            data['photo'] = this.state.imageBase64;
        }
        apiDashboard.export(data).then(function(response) {
            _.setState({loadedExport: true});
            window.location = response.data['file'];
        });
    }

    keywordtool(_, i) {
        var data = {
            'params': {
                'tags': _.state.tags[i],
                'format': 'json'
            }
        };

        apiDashboard.keywordtool(data).then(function(response) {
            var stats = (_.state.stats).concat(response.data.keywords);
            stats = lodash.sortBy(stats, 'volume').reverse();
            _.setState({stats: stats})
            _.setState({loadedKeywords: true});
            i++;
            if (i < _.state.tags.length) {
                _.keywordtool(_, i);
            }
        });

    }

    calculate() {
        var _ = this;
        var data = {
            'params': {
                'tags': (_.state.tags).toString(),
                'format': 'json'
            }
        }

        _.setState({loadedSimilars: false});
        _.setState({loadedKeywords: false});

        apiDashboard.synonyms(data).then(function(response) {
            var similars = response.data.synonyms;
            _.setState({similars: similars})
            apiDashboard.antonyms(data).then(function(response) {
                similars.concat(response.data.antonyms);
                _.setState({similars: similars});
                _.setState({loadedSimilars: true});
                _.setState({stats: []});
                _.keywordtool(_, 0);
            });
        });
    }

    render() {
        return (
            <Grid className="dashboard-page" style={{
                paddingBottom: '50px'
            }} fluid={true}>
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
                <div className="dashboard-content">
                    <Row>
                        <Col md={9}>
                            <Row>
                                <Col md={4}>
                                    <Panel className="photo-block text-center" style={{
                                        height: '335px'
                                    }}>
                                        <p>
                                            <Image src={this.state.thumbnail} width={250} height={250}/>
                                        </p>
                                        <Dropzone onDrop={this.onUploadImage} multiple={false} rejectStyle>
                                            <Button bsStyle="primary" block>
                                                <i className="icon ion-arrow-up-c"></i>
                                                Upload image (.jpg / .png)</Button>
                                        </Dropzone>
                                    </Panel>
                                </Col>
                                <Col md={8}>
                                    <Row>
                                        <Col md={12}>
                                            <Panel header="What keywords descript this t-shirt?" style={{
                                                height: 155
                                            }}>
                                                <Form inline>
                                                    <Row>
                                                        <Col md={9}>
                                                            <FormGroup controlId="formControlsTextarea" style={{
                                                                'width': '100%'
                                                            }}>
                                                                <TagsInput maxTags={4} value={this.state.tags} onChange={:: this.handleChangeTags}/>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={3} className="text-center">
                                                            <Row>
                                                                <Col md={12}>
                                                                    <p>
                                                                        <Button disabled={this.state.tags.length == 0} bsStyle="primary" block onClick={this.calculate}>
                                                                            <i className="icon ion-calculator"></i>
                                                                            Calculate
                                                                        </Button>
                                                                    </p>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md={12}>
                                                                    <p>
                                                                        <Button bsStyle="primary" block onClick={this.reset}>
                                                                            <i className="icon ion-android-refresh"></i>
                                                                            Reset
                                                                        </Button>
                                                                    </p>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>

                                                </Form>
                                            </Panel>
                                        </Col>
                                        <Col md={12}>
                                            <Panel header="Synonyms / Antonyms" style={{
                                                height: 170
                                            }}>
                                                <Loader loaded={this.state.loadedSimilars}>
                                                    {this.state.similars.length == 0
                                                        ? <div>Empty</div>
                                                        : null}
                                                    <Row className="scroll-block">
                                                        {this.state.similars.map(function(item, i) {
                                                            return <Col md={6} style={{
                                                                cursor: 'pointer'
                                                            }} onClick={this.addWord} data-word={item}>
                                                                <i className="icon ion-android-add-circle"></i>{' '}{item}</Col>
                                                        }, this)}
                                                    </Row>
                                                </Loader>
                                            </Panel>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{
                                paddingBottom: 10
                            }}>
                                <Col md={12}>
                                    <Panel style={{
                                        height: '355px'
                                    }}>
                                        <Row>
                                            <Col md={12} className="templates-list">
                                                <Nav bsStyle="tabs" activeKey={this.state.activeShop} onSelect={this.handleShop}>
                                                    {this.state.shops.map(function(item, i) {
                                                        return <NavItem eventKey={i}>{item.name}</NavItem>
                                                    }, this)}
                                                </Nav>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={12}>
                                                <div className="templates">
                                                    <b>Templates</b>
                                                </div>
                                                <ul className="list-inline">
                                                    {this.state.templates.map(function(item, i) {
                                                        return <li>
                                                            <Button onClick={this.handleTemplate} data-id={i} disabled={i == this.state.activeTemplate}>{item.name}</Button>
                                                        </li>
                                                    }, this)}
                                                </ul>
                                            </Col>
                                            <Col md={12}>
                                                <FormGroup>
                                                    <ControlLabel>Title</ControlLabel>
                                                    <FormControl type="text" placeholder="Title - 4 to 8 words is best" onChange={this.handleTitle} value={this.state.template.title}/>
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <ControlLabel>Description</ControlLabel>
                                                    <FormControl type="text" placeholder="Dref description of work to get your audience all excited" onChange={this.handleFirstDescription} value={this.state.template.first_description}/>
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <ControlLabel>Tags</ControlLabel>
                                                    <FormControl type="text" placeholder="Use, comas to-separate-tags" onChange={this.handleSecondDescription} value={this.state.template.second_description}/>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Panel>

                                </Col>
                            </Row>
                        </Col>
                        <Col md={3}>
                            <Panel header="Amazon keywords auto suggest" className="suggestions-block" style={{
                                height: '700px'
                            }}>
                                <Loader loaded={this.state.loadedKeywords}>
                                    {this.state.stats.length == 0
                                        ? <div className="empty-result">Empty</div>
                                        : null}
                                    <div className="scroll-block-suggestions suggestions">
                                        {this.state.stats.map(function(item, i) {
                                            return <Row>
                                                <Col md={1}>
                                                    <span className="index">{i + 1}.</span>
                                                </Col>
                                                <Col md={6}>
                                                    <p className="name">{item.name}</p>
                                                </Col>
                                                <Col md={3} className="text-right">
                                                    <span className="volume">{item.volume}</span>
                                                </Col>
                                                <Col md={1} className="text-left">
                                                    <i onClick={this.addWord} style={{
                                                        cursor: 'cursor'
                                                    }} data-word={item.name} className="icon ion-android-add-circle"></i>
                                                </Col>
                                            </Row>
                                        }, this)}
                                    </div>
                                </Loader>
                            </Panel>
                        </Col>
                    </Row>
                </div>
                <div id="footer">
                    <Row>
                        <Col md={2}></Col>
                        <Col md={8} className="text-right">
                            <Loader loaded={this.state.loadedExport}>
                                <Button bsStyle="success" disabled={this.state.tags.length == 0} onClick={this.exportData}>
                                    <i className="icon ion-arrow-down-c"></i>
                                    Export data
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
