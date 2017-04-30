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
            copied: false,
            keywords: [],
            imageBase64: '',
            loadedExport: true,
            suggestIndex: 0,
            progress: 20,
            thumbnailStatus: false,
            username: localStorage.getItem('username'),
            thumbnail: '/static/images/dashboard/shirt.png',
            thumbnailBackground: '#e1e0f0',
            validate: {
                title: 90,
                description: 180,
                tags: 60,
                main_tags: 60
            },
            data: {
                title: 90,
                description: 180,
                tags: 60,
                main_tags: 60
            }
        };
        this.onUploadImage = this.onUploadImage.bind(this);
        this.calculate = this.calculate.bind(this);
        this.exportTemplates = this.exportTemplates.bind(this);
        this.handleShop = this.handleShop.bind(this);
        this.handleTemplate = this.handleTemplate.bind(this);
        this.reset = this.reset.bind(this);
        this.addWord = this.addWord.bind(this);
        this.handleTitle = this.handleTitle.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.handleTags = this.handleTags.bind(this);
        this.handleMainTags = this.handleMainTags.bind(this);
        this.handleThumbnailChange = this.handleThumbnailChange.bind(this);
        this.exportKeywords = this.exportKeywords.bind(this);
        this.handleSuggests = this.handleSuggests.bind(this);
    }

    handleSuggests(key) {
        this.setState({suggestIndex: key});
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

    addWord(event) {
        var template = this.state.template;
        template.title = template.title.replace('{}', event.target.getAttribute('data-word'));
        template.description = template.description.replace('{}', event.target.getAttribute('data-word'));
        template.tags = template.tags.replace('{}', event.target.getAttribute('data-word'));
        template.main_tags = template.main_tags.replace('{}', event.target.getAttribute('data-word'));

        this.setState({template: template});
    }

    handleTitle(event) {
        if (this.state.validate.title - event.target.value.length >= 0) {
            var template = this.state.template;
            template.title = event.target.value
            this.setState({template: template});

            var data = this.state.data;
            data.title = this.state.validate.title - event.target.value.length;
        } else {
            var data = this.state.data;
            data.title = 0;
        }
        this.setState({data: data});
    }

    handleMainTags(event) {
        if (this.state.validate.main_tags - event.target.value.length >= 0) {
            var template = this.state.template;
            template.main_tags = event.target.value
            this.setState({template: template});

            var data = this.state.data;
            data.main_tags = this.state.validate.main_tags - event.target.value.length;
        } else {
            var data = this.state.data;
            data.main_tags = 0;
        }
        this.setState({data: data});
    }

    handleTags(event) {
        if (this.state.validate.tags - event.target.value.length >= 0) {
            var template = this.state.template;
            template.tags = event.target.value
            this.setState({template: template});

            var data = this.state.data;
            data.tags = this.state.validate.tags - event.target.value.length;
        } else {
            var data = this.state.data;
            data.tags = 0;
        }
        this.setState({data: data});
    }

    handleDescription(event) {
        if (this.state.validate.description - event.target.value.length >= 0) {
            var template = this.state.template;
            template.description = event.target.value
            this.setState({template: template});

            var data = this.state.data;
            data.description = this.state.validate.description - event.target.value.length;
        } else {
            var data = this.state.data;
            data.description = 0;
        }
        this.setState({data: data});
    }

    handleShop(index) {
        this.setState({activeShop: index, templates: this.state.shops[index].templates, activeTemplate: 0, template: this.state.shops[index].templates[0]})

        var template = this.state.shops[index].templates[0];
        var data = this.state.data;
        data.title = this.state.validate.title - template.title.length;
        data.description = this.state.validate.description - template.description.length;
        data.tags = this.state.validate.tags - template.tags.length;
        data.main_tags = this.state.validate.main_tags - template.main_tags.length;
        this.setState({data: data});
    }

    handleTemplate(event) {
        this.setState({
            activeTemplate: event.target.getAttribute('data-id'),
            template: this.state.templates[event.target.getAttribute('data-id')]
        });

        var template = this.state.templates[event.target.getAttribute('data-id')];
        var data = this.state.data;
        data.title = this.state.validate.title - template.title.length;
        data.description = this.state.validate.description - template.description.length;
        data.tags = this.state.validate.tags - template.tags.length;
        data.main_tags = this.state.validate.main_tags - template.main_tags.length;
        this.setState({data: data});
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
            _.setState({stats: stats})
            _.setState({loadedKeywords: true});
            _.setState({
                progress: Math.round(100 / (_.state.tags.length - i))
            });
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

        _.setState({progress: 20});
        _.setState({loadedSimilars: false});
        _.setState({loadedKeywords: false});
        _.setState({suggestIndex: 0});

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
                                        <Toggle defaultChecked={this.state.thumbnailStatus} onChange={this.handleThumbnailChange} icons={false}/>
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
                                                                            Start Over
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
                                                            return <Col md={6}>
                                                                <i style={{
                                                                    cursor: 'pointer'
                                                                }} onClick={this.addWord} data-word={item} className="icon ion-android-add-circle"></i>{' '}{item}</Col>
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
                                                        <b>{this.state.data.title}</b>{' '}characters</div>
                                                    <ControlLabel>Title</ControlLabel>
                                                    <InputGroup>
                                                        <FormControl type="text" placeholder="Title - 4 to 8 words is best" onChange={this.handleTitle} value={this.state.template.title}/>
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
                                                        <b>{this.state.data.description}</b>{' '}characters</div>
                                                    <ControlLabel>Description</ControlLabel>
                                                    <InputGroup>
                                                        <FormControl componentClass="textarea" rows={5} placeholder="Dref description of work to get your audience all excited" onChange={this.handleDescription} value={this.state.template.description}/>
                                                        <CopyToClipboard text={this.state.template.description} onCopy={() => this.setState({copied: true})}>
                                                            <InputGroup.Addon>
                                                                <span className="ion-clipboard"></span>
                                                            </InputGroup.Addon>
                                                        </CopyToClipboard>
                                                    </InputGroup>
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                {this.state.template.shop != 2
                                                    ? <FormGroup>
                                                            <div className="tags">
                                                                <b>{this.state.data.tags}</b>{' '}characters</div>
                                                            <ControlLabel>Tags</ControlLabel>
                                                            <InputGroup>
                                                                <FormControl type="text" placeholder="Use, comas to-separate-tags" onChange={this.handleTags} value={this.state.template.tags}/>
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
                                                                <b>{this.state.data.main_tags}</b>{' '}characters</div>
                                                            <ControlLabel>Main tags</ControlLabel>
                                                            <InputGroup>
                                                                <FormControl type="text" placeholder="What one tag would I search to find your design?" onChange={this.handleMainTags} value={this.state.template.main_tags}/>
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
                                    </Panel>

                                </Col>
                            </Row>
                        </Col>
                        <Col md={3}>
                            <Panel header="Amazon keywords auto suggest" className="suggestions-block" style={{
                                height: '745px'
                            }}>
                                <Loader loaded={this.state.loadedKeywords}>
                                    {this.state.stats.length == 0
                                        ? <div className="empty-result">Empty</div>
                                        : null}
                                    {this.state.stats.length > 0
                                        ? <div className="scroll-block-suggestions suggestions">
                                                {this.state.progress < 100 ?
                                                  <ProgressBar active now={this.state.progress} label={`${this.state.progress}%`}  />
                                                : null}
                                                <Tabs activeKey={this.state.suggestIndex} animation={false} onSelect={this.handleSuggests}>
                                                    {this.state.keywords.map(function(keyword, i) {
                                                        return <Tab eventKey={i} title={this.state.tags[i]}>
                                                            {this.state.keywords[i].map(function(item, j) {
                                                                return <Row>
                                                                    <Col md={1}>
                                                                        <span className="index">{j + 1}.</span>
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
                        <Navbar>
                            <Nav style={{
                                paddingRight: '20%'
                            }} pullRight>
                                <NavItem>
                                    <Loader loaded={this.state.loadedExport}>
                                        <OverlayTrigger trigger="click" placement="top" overlay={exportWindow}>
                                            <Button bsStyle="success" disabled={this.state.tags.length == 0}>
                                                <i className="icon ion-arrow-down-c"></i>
                                                Export
                                            </Button>
                                        </OverlayTrigger>
                                    </Loader>
                                </NavItem>
                            </Nav>
                        </Navbar>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
