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
    Tab,
    ProgressBar
} from 'react-bootstrap';

import {Link, browserHistory} from 'react-router';
import React, {Component} from 'react';
import TagsInput from 'react-tagsinput';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import Loader from 'react-loader';
import format from 'string-format';
import lodash from 'lodash';
import Toggle from 'react-toggle';
import CopyToClipboard from 'react-copy-to-clipboard';

import MixinAuth from '../mixins/auth';
import {apiDashboard} from '../api/dashboard';
import {apiProfiles} from '../api/profiles';
import Templates from '../components/templates';

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
            loadedTrademark: true,
            loadedTemplates: true,
            loadedKeywords: true,
            copied: false,
            keywords: [],
            keywordsTitle: [],
            imageBase64: '',
            loadedExport: true,
            suggestIndex: 0,
            progress: 20,
            progressShow: true,
            thumbnailStatus: false,
            username: localStorage.getItem('username'),
            thumbnail: '/static/images/dashboard/shirt.png',
            thumbnailBackground: '#e1e0f0',
            validate: {
                title: 90,
                description: 180,
                tags: 55,
                main_tags: 55
            },
            data: {
                title: 90,
                description: 180,
                tags: 55,
                main_tags: 55
            }
        };
        this.onUploadImage = this.onUploadImage.bind(this);
        this.calculate = this.calculate.bind(this);
        this.exportTemplates = this.exportTemplates.bind(this);
        this.handleShop = this.handleShop.bind(this);
        this.handleTemplate = this.handleTemplate.bind(this);
        this.reset = this.reset.bind(this);
        this.resetKeywords = this.resetKeywords.bind(this);
        this.addWord = this.addWord.bind(this);
        this.handleChangeForms = this.handleChangeForms.bind(this);
        this.handleThumbnailChange = this.handleThumbnailChange.bind(this);
        this.exportKeywords = this.exportKeywords.bind(this);
        this.handleSuggests = this.handleSuggests.bind(this);
        this.dragWordStart = this.dragWordStart.bind(this);
        this.dropWord = this.dropWord.bind(this);
        this.preventDefault = this.preventDefault.bind(this);
        this.newTemplate = this.newTemplate.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.trademarks = this.trademarks.bind(this);
    }

    componentWillMount() {
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
        document.addEventListener("keyup", this.handleKeyPress.bind(this));
    }

    handleKeyDown(event) {
        if (event.keyCode == 13 && event.target.getAttribute('data-keypress') == 'dashboard') {
            var attr = event.target.getAttribute('data-type');
            var template = this.state.template;
            template[attr] = event.target.value + ' [______] ';
            if (this.state.validate[attr] - event.target.value.length > 0) {
                var data = this.state.data;
                data[attr] = this.state.validate[attr] - template[attr].length;
                this.setState({template: template, data: data});
            }
            event.preventDefault();
            return false;
        }
    }

    handleKeyPress(event) {
        if (event.keyCode == 8 && event.target.getAttribute('data-keypress') == 'dashboard') {
            var attr = event.target.getAttribute('data-type');
            var template = this.state.template;
            template[attr] = event.target.value.replace(' [______ ', '');
            if (this.state.validate[attr] - event.target.value.length > 0) {
                var data = this.state.data;
                data[attr] = this.state.validate[attr] - template[attr].length;
                this.setState({template: template, data: data});
            }
            event.preventDefault();
            return false;
        }
    }

    newTemplate(data) {
        var _ = this;
        _.setState({loadedTemplates: false});
        apiDashboard.newTemplates(data).then(function(response) {
            var templates = _.state.templates;
            templates.push(response.data);
            _.setState({loadedTemplates: true, templates: templates});
        });
    }

    preventDefault(event) {
        event.preventDefault();
    }

    resetKeywords(event) {
        this.setState({tags: []});
    }

    dropWord(event) {
        event.preventDefault();
        var data;
        data = event.dataTransfer.getData('word');
        if (data.length > 0) {
            var template = this.state.template;

            if (this.state.validate[event.target.getAttribute('data-type')] - event.target.value.length >= 0) {
                template[event.target.getAttribute('data-type')] = event.target.value.replace('[______]', data);
                var data = this.state.data;
                data[event.target.getAttribute('data-type')] = this.state.validate[event.target.getAttribute('data-type')] - event.target.value.replace('[______]', data).length;
            } else {
                var data = this.state.data;
                data[event.target.getAttribute('data-type')] = 0;
            }
            this.setState({data: data});
            this.setState({template: template});
        }

    }

    handleSuggests(key) {
        this.setState({suggestIndex: key});
    }

    dragWordStart(event) {
        event.dataTransfer.setData('word', event.target.getAttribute('data-word'));
    }

    handleThumbnailChange() {
        this.setState({
            thumbnailStatus: !this.state.thumbnailStatus
        });
        if (this.state.thumbnailStatus) {
            this.setState({thumbnailBackground: '#e1e0f0'});
        } else {
            this.setState({thumbnailBackground: '#56576c'});
        }
    }

    reset() {
        this.setState({tags: [], similars: [], stats: [], thumbnail: '/static/images/dashboard/shirt.png'});
    }

    trademarks() {
        var _ = this;
        _.setState({loadedTrademark: false});
        var stats = this.state.stats;

        var words = '';
        for (var i = 0; i < this.state.stats.length; i++) {
          if (i < 50) {
            words += (i == 0
                ? ''
                : ',') + this.state.stats[i].name;
          }
        }
        var data = {
            'words': words
        }
        apiDashboard.trademarks(data).then(function(response) {
            for (var i = 0; i < response.data.length; i++) {
              if (response.data[i].count > 0) {
                stats[i]['trademark'] = true
              }
            }
            _.setState({loadedTrademark: true, stats: stats});
        });
    }

    addWord(event) {
        var template = this.state.template;
        template.title = template.title.replace('[______]', event.target.getAttribute('data-word'));
        template.description = template.description.replace('[______]', event.target.getAttribute('data-word'));
        template.tags = template.tags.replace('[______]', event.target.getAttribute('data-word'));
        template.main_tags = template.main_tags.replace('[______]', event.target.getAttribute('data-word'));
        this.setState({template: template});

        var data = this.state.data;
        var fields = ['title', 'description', 'tags', 'main_tags'];
        for (var i = 0; i < fields.length; i++) {
            data[fields[i]] = this.state.validate[fields[i]] - template[fields[i]].length;
        }
        this.setState({data: data});

    }

    handleChangeForms(event) {
        var template = this.state.template;
        var value = event.target.value;
        template[event.target.getAttribute('data-type')] = value;
        this.setState({template: template});

        var data = this.state.data;
        data[event.target.getAttribute('data-type')] = this.state.validate[event.target.getAttribute('data-type')] - value.length;
        this.setState({data: data});
    }

    handleShop(index) {
        var template = this.state.shops[index].templates[0];
        var data = this.state.data;
        data.title = this.state.validate.title - template.title.length;
        data.description = this.state.validate.description - template.description.length;
        data.tags = this.state.validate.tags - template.tags.length;
        data.main_tags = this.state.validate.main_tags - template.main_tags.length;
        this.setState({activeShop: index, templates: this.state.shops[index].templates, activeTemplate: 0, data: data, template: this.state.shops[index].templates[0]})
    }

    handleTemplate(event) {
        var template = this.state.templates[event.target.getAttribute('data-id')];
        var data = this.state.data;
        data.title = this.state.validate.title - template.title.length;
        data.description = this.state.validate.description - template.description.length;
        data.tags = this.state.validate.tags - template.tags.length;
        data.main_tags = this.state.validate.main_tags - template.main_tags.length;
        this.setState({
            activeTemplate: event.target.getAttribute('data-id'),
            template: this.state.templates[event.target.getAttribute('data-id')],
            data: data
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

        _.setState({loadedTemplates: false});
        apiDashboard.templates().then(function(response) {
            var data = _.state.data;
            var template = response.data[0].templates[0];
            data.title = _.state.validate.title - template.title.length;
            data.description = _.state.validate.description - template.description.length;
            data.tags = _.state.validate.tags - template.tags.length;
            data.main_tags = _.state.validate.main_tags - template.main_tags.length;

            _.setState({shops: response.data, templates: response.data[0].templates, template: template, data: data, loadedTemplates: true});
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

    exportTemplates() {
        var _ = this;
        _.setState({loadedExport: false});
        var data = {
            'title': this.state.template.title,
            'description': this.state.template.description,
            'tags': this.state.template.tags,
            'keywords': this.state.tags.toString()
        }
        if (this.state.imageBase64.length > 0) {
            data['photo'] = this.state.imageBase64;
        }
        apiDashboard.exportTemplates(data).then(function(response) {
            _.setState({loadedExport: true});
            window.location = response.data['file'];
        });
    }

    exportKeywords() {
        var _ = this;
        _.setState({loadedExport: false});
        var data = {
            'keywords': JSON.stringify(_.state.stats)
        };
        apiDashboard.exportKeywords(data).then(function(response) {
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
            var keywords = _.state.keywords;
            var sortKeywords = lodash.sortBy(response.data.keywords, 'volume').reverse();
            keywords.push(sortKeywords);
            _.setState({keywords: keywords});

            var stats = (_.state.stats).concat(response.data.keywords);
            stats = lodash.sortBy(stats, 'volume').reverse();
            _.setState({stats: stats});

            var keywordsTitle = _.state.keywordsTitle;
            keywordsTitle.push(_.state.tags[i]);
            _.setState({keywordsTitle: keywordsTitle})

            _.setState({loadedKeywords: true});
            _.setState({
                progress: Math.round(100 / (_.state.tags.length - i))
            });

            if (_.state.progress > 99) {
                setTimeout(function() {
                    _.setState({progressShow: false});
                }, 2000);
            }

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

        _.setState({
            keywordsTitle: [],
            keywords: [],
            progress: 20,
            progressShow: true,
            loadedSimilars: false,
            loadedKeywords: false,
            suggestIndex: 0
        });

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
        const exportWindow = (
            <Popover className="export-list">
                <ul className="list-inline">
                    <li>
                        <Button bsStyle="primary" onClick={this.exportKeywords}>Keywords</Button>
                    </li>
                    <li>
                        <Button bsStyle="primary" onClick={this.exportTemplates}>Templates</Button>
                    </li>
                </ul>
            </Popover>
        );

        return (
            <Grid className="dashboard-page" fluid={true}>
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
                                        <Toggle defaultChecked={this.state.thumbnailStatus} icons={{
                                            checked: <span className="ion-ios-sunny toogle-sunny"></span>,
                                            unchecked: <span className="ion-ios-moon toogle-moon"></span>
                                        }} onChange={this.handleThumbnailChange}/>
                                        <p style={{
                                            backgroundColor: this.state.thumbnailBackground
                                        }}>
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
                                        <Col md={12} className="keywords">
                                            <Panel header="What keywords descript this t-shirt?" style={{
                                                height: 155
                                            }}>
                                                <Form inline>
                                                    <Row>
                                                        <Col md={12}>
                                                            <FormGroup controlId="formControlsTextarea" style={{
                                                                'width': '100%'
                                                            }}>
                                                                <TagsInput maxTags={4} value={this.state.tags} onChange={:: this.handleChangeTags}/>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={12} className="actions">
                                                            <Row>
                                                                <Col md={6} className="text-left">
                                                                    <Button disabled={this.state.tags.length == 0} bsStyle="primary" onClick={this.resetKeywords}>
                                                                        <i className="icon ion-backspace"></i>
                                                                        Reset Keywords
                                                                    </Button>
                                                                </Col>
                                                                <Col md={3} className="text-right">
                                                                    <Loader loaded={this.state.loadedTrademark}>
                                                                      <Button disabled={this.state.stats.length == 0} bsStyle="primary" onClick={this.trademarks}>
                                                                          <i className="icon ion-android-search"></i>
                                                                          Trademarks
                                                                      </Button>
                                                                    </Loader>
                                                                </Col>
                                                                <Col md={3} className="text-right">
                                                                    <Button disabled={this.state.tags.length == 0} bsStyle="primary" onClick={this.calculate}>
                                                                        <i className="icon ion-calculator"></i>
                                                                        Calculate
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>

                                                </Form>
                                            </Panel>
                                        </Col>
                                        <Col md={12} className="similars">
                                            <Panel header="Synonyms / Antonyms" style={{
                                                height: 170
                                            }}>
                                                <Loader loaded={this.state.loadedSimilars}>
                                                    <Row>
                                                        {this.state.similars.length == 0
                                                            ? <div style={{
                                                                    paddingLeft: '15px'
                                                                }} className="text-center">Use different keywords.</div>
                                                            : null}
                                                        {this.state.similars.map(function(item, i) {
                                                            return <Col md={6}>
                                                                <button className="ion-plus plus-button" onClick={this.addWord} data-word={item}></button>
                                                                <span draggable='true' className="btn-container" onDragStart={this.dragWordStart} style={{
                                                                    cursor: 'move'
                                                                }} data-word={item}>{item}</span>
                                                            </Col>
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
                                        height: '400px'
                                    }}>
                                        <Loader loaded={this.state.loadedTemplates}>
                                            <Row>
                                                <Col md={12} className="templates-list">
                                                    <Nav bsStyle="tabs" activeKey={this.state.activeShop} onSelect={this.handleShop}>
                                                        {this.state.shops.map(function(item, i) {
                                                            return <NavItem eventKey={i}>{item.name}</NavItem>
                                                        }, this)}
                                                    </Nav>
                                                </Col>
                                            </Row>

                                            <Row className="templates">
                                                <Col md={12}>
                                                    <div className="templates">
                                                        <b>Templates</b>
                                                    </div>
                                                    <ul className="list-inline">
                                                        <li><Templates shop={this.state.activeShop} shops={this.state.shops} newTemplate={this.newTemplate}/></li>
                                                        {this.state.templates.map(function(item, i) {
                                                            return <li>
                                                                <Button onClick={this.handleTemplate} data-id={i} disabled={i == this.state.activeTemplate}>{item.name}</Button>
                                                            </li>
                                                        }, this)}
                                                    </ul>
                                                </Col>
                                                <Col md={12}>
                                                    <FormGroup>
                                                        <div className="title">
                                                            <b style={{
                                                                color: this.state.data.title < 10
                                                                    ? '#f50313'
                                                                    : '#ccc'
                                                            }}>{this.state.data.title}</b>{' '}characters</div>
                                                        <ControlLabel>Title</ControlLabel>
                                                        <InputGroup>
                                                            <FormControl type="text" onDragOver={this.preventDefault} onDrop={this.dropWord} data-type="title" data-keypress="dashboard" placeholder="Title - 4 to 8 words is best" onChange={this.handleChangeForms} value={this.state.template.title}/>
                                                            <CopyToClipboard text={this.state.template.title} onCopy={() => this.setState({copied: true})}>
                                                                <InputGroup.Addon>
                                                                    <span className="ion-clipboard"></span>
                                                                </InputGroup.Addon>
                                                            </CopyToClipboard>
                                                        </InputGroup>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <div className="description">
                                                            <b style={{
                                                                color: this.state.data.description < 10
                                                                    ? '#f50313'
                                                                    : '#ccc'
                                                            }}>{this.state.data.description}</b>{' '}characters</div>
                                                        <ControlLabel>Description</ControlLabel>
                                                        <InputGroup>
                                                            <FormControl componentClass="textarea" onDragOver={this.preventDefault} onDrop={this.dropWord} data-type="description" data-keypress="dashboard" rows={5} placeholder="Dref description of work to get your audience all excited" onChange={this.handleChangeForms} value={this.state.template.description}/>
                                                            <CopyToClipboard text={this.state.template.description} onCopy={() => this.setState({copied: true})}>
                                                                <InputGroup.Addon>
                                                                    <span className="ion-clipboard"></span>
                                                                </InputGroup.Addon>
                                                            </CopyToClipboard>
                                                        </InputGroup>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    {this.state.template.shop > 2
                                                        ? <FormGroup>
                                                                <div className="tags">
                                                                    <b style={{
                                                                        color: this.state.data.tags < 10
                                                                            ? '#f50313'
                                                                            : '#ccc'
                                                                    }}>{this.state.data.tags}</b>{' '}characters</div>
                                                                <ControlLabel>Tags</ControlLabel>
                                                                <InputGroup>
                                                                    <FormControl type="text" onDragOver={this.preventDefault} onDrop={this.dropWord} data-type="tags" data-keypress="dashboard" placeholder="Use, comas to-separate-tags" onChange={this.handleChangeForms} value={this.state.template.tags}/>
                                                                    <CopyToClipboard text={this.state.template.tags} onCopy={() => this.setState({copied: true})}>
                                                                        <InputGroup.Addon>
                                                                            <span className="ion-clipboard"></span>
                                                                        </InputGroup.Addon>
                                                                    </CopyToClipboard>
                                                                </InputGroup>
                                                            </FormGroup>
                                                        : null}
                                                    {this.state.template.shop == 4
                                                        ? <FormGroup>
                                                                <div className="main-tags">
                                                                    <b style={{
                                                                        color: this.state.data.main_tags < 10
                                                                            ? '#f50313'
                                                                            : '#ccc'
                                                                    }}>{this.state.data.main_tags}</b>{' '}characters</div>
                                                                <ControlLabel>Main tags</ControlLabel>
                                                                <InputGroup>
                                                                    <FormControl type="text" onDragOver={this.preventDefault} onDrop={this.dropWord} data-type="main_tags" data-keypress="dashboard" placeholder="What one tag would I search to find your design?" onChange={this.handleChangeForms} value={this.state.template.main_tags}/>
                                                                    <CopyToClipboard text={this.state.template.main_tags} onCopy={() => this.setState({copied: true})}>
                                                                        <InputGroup.Addon>
                                                                            <span className="ion-clipboard"></span>
                                                                        </InputGroup.Addon>
                                                                    </CopyToClipboard>
                                                                </InputGroup>
                                                            </FormGroup>
                                                        : null}
                                                </Col>
                                            </Row>
                                        </Loader>
                                    </Panel>

                                </Col>
                            </Row>
                        </Col>
                        <Col md={3}>
                            <Panel header="Amazon Auto Suggest + Google Search Traffic" className="suggestions-block" style={{
                                height: '745px'
                            }}>
                                <Loader loaded={this.state.loadedKeywords}>
                                    {this.state.stats.length == 0
                                        ? <div className="text-center">Use different keywords.</div>
                                        : null}
                                    {this.state.stats.length > 0
                                        ? <div className="suggestions">
                                                {this.state.progressShow
                                                    ? <ProgressBar active now={this.state.progress} label={`${this.state.progress}%`}/>
                                                    : null}
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
                        </Col>
                    </Row>
                </div>
                <Row id="footer">
                    <Col md={12}>
                        {this.state.tags}
                        <Navbar>
                            <Nav style={{
                                paddingRight: '20%'
                            }} pullLeft>
                                <NavItem>
                                    <Loader loaded={this.state.loadedExport}>
                                        <OverlayTrigger trigger="click" placement="top" overlay={exportWindow}>
                                            <Button bsStyle="success" disabled={this.state.tags.length == 0}>
                                                <i className="icon ion-arrow-down-c"></i>
                                                Export Data
                                            </Button>
                                        </OverlayTrigger>
                                    </Loader>
                                </NavItem>
                                <NavItem>
                                    <Button bsStyle="primary" onClick={this.reset}>
                                        <i className="icon ion-refresh"></i>
                                        Start Over
                                    </Button>
                                </NavItem>
                            </Nav>
                        </Navbar>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
