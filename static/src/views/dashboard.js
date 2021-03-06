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
    ProgressBar,
    IndexLinkContainer
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
        var user = JSON.parse(localStorage.getItem("user"));
        this.state = {
            tags: [],
            similars: [],
            user: user,
            vip: false,
            print: 0,
            active: false,
            loadedPlan: false,
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
                brand_name: 90,
                title: 90,
                description: 256,
                tags: 256,
                main_tags: 256
            },
            data: {
                brand_name: 90,
                title: 90,
                description: 256,
                tags: 256,
                main_tags: 256
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
    }

    componentWillMount() {
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
        document.addEventListener("keyup", this.handleKeyPress.bind(this));
        document.body.style.backgroundColor = "#454656";
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

    addWord(event) {
        var template = this.state.template;
        template.title = template.title.replace('[______]', event.target.getAttribute('data-word'));
        template.description = template.description.replace('[______]', event.target.getAttribute('data-word'));
        template.tags = template.tags.replace('[______]', event.target.getAttribute('data-word'));
        template.main_tags = template.main_tags.replace('[______]', event.target.getAttribute('data-word'));
        this.setState({template: template});

        var data = this.state.data;
        var fields = ['title', 'brand_name', 'description', 'tags', 'main_tags'];
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
                    var user = response.data;
                    _.setState({
                        vip: user.vip,
                        active: user.active,
                        print: user.count,
                        loadedPlan: true,
                        user: user
                    });
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
            'brand_name': this.state.template.brand_name,
            'description': this.state.template.description,
            'tags': this.state.template.tags,
            'main_tags': this.state.template.main_tags,
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

            var stats = _.state.stats;

            var words = '';
            for (var index = 0; index < _.state.stats.length; index++) {
                words += (index == 0
                    ? ''
                    : ',') + _.state.stats[index].name;
            }
            var data = {
                'words': words
            }
            apiDashboard.trademarks(data).then(function(response) {
                for (var j = 0; j < response.data.length; j++) {
                  if (response.data[j].count > 0) {
                    stats[j]['trademark'] = true
                  }
                }
                _.setState({stats: stats});
            });

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
        var print = 0;
        if (_.state.vip == false) {
          print = (_.state.print - 1);
        } else {
          print = _.state.print;
        }
        _.setState({
            keywordsTitle: [],
            keywords: [],
            progress: 20,
            print: print,
            progressShow: true,
            loadedSimilars: false,
            loadedKeywords: false,
            suggestIndex: 0
        });

        apiDashboard.synonyms(data).then(function(response) {
            console.log(data, response);
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

        const limitWindow = (
            <Popover>
              <p>You have Plan you can do 200 calculations a day.</p>
            </Popover>
        );

        const limitWindowFree = (
            <Popover>
              <p>You have <b>"Free" Plan</b> you can do 1 calculation a day. Please <a href="/payments/">Upgrade plan</a>.</p>
            </Popover>
        );

        return (
            <Grid className="dashboard-page" fluid={true}>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link className="logo" to="/dashboard/"><Image style={{width: '170px'}} src="/static/images/logo.png" /></Link>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav>
                        <MenuItem href="/dashboard/" className="active">Dashboard</MenuItem>
                        <MenuItem href="/research-page/">Research</MenuItem>
                        <MenuItem href="/keyword-suggestions/">Keywords</MenuItem>
                    </Nav>
                    <Nav pullRight>
                        <NavDropdown title={this.state.username} id="basic-nav-dropdown">
                             <MenuItem disabled >Dashboard</MenuItem>
                             <MenuItem href="/profile/">Settings</MenuItem>
                             <MenuItem href="/research-page/">Research page</MenuItem>
                             <MenuItem divider />
                             <MenuItem href="/">Exit</MenuItem>
                      </NavDropdown>
                    </Nav>
                </Navbar>
                <div className="container">
                    <Row className="dashboard-content">
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
                                                            <Loader loaded={this.state.loadedPlan}>
                                                            <Row>
                                                                <Col md={5} className="text-left">
                                                                    <a disabled={this.state.tags.length == 0} className="reset-keywords btn btn-outline" onClick={this.resetKeywords}>
                                                                        <i className="icon ion-backspace"></i>
                                                                        Reset Keywords
                                                                    </a>
                                                                </Col>
                                                                <Col md={4} className="text-right limit">
                                                                  {!this.state.vip?
                                                                    <span>
                                                                      {this.state.active?
                                                                        <OverlayTrigger trigger="click" placement="bottom" overlay={limitWindow}>
                                                                          <p><b>{this.state.print}</b> listings left <a href="#"><span className="icon ion-ios-help-outline"></span></a></p>
                                                                        </OverlayTrigger>
                                                                      : null}
                                                                      {!this.state.active?
                                                                        <OverlayTrigger trigger="click" placement="bottom" overlay={limitWindowFree}>
                                                                          <p><b>{this.state.print}</b> listing left <a href="#"><span className="icon ion-ios-help-outline"></span></a></p>
                                                                        </OverlayTrigger>
                                                                      : null}
                                                                    </span>
                                                                  : null}
                                                                </Col>
                                                                <Col md={3} className="text-right">
                                                                    {this.state.print > 0 ?
                                                                      <Button disabled={this.state.tags.length == 0} className={"animated infinite " + (this.state.tags.length == 0 ? '' : 'pulse')} bsStyle="primary" onClick={this.calculate}>
                                                                          <i className="icon ion-calculator"></i>
                                                                          Calculate
                                                                      </Button>
                                                                    : null}
                                                                </Col>
                                                            </Row>
                                                            </Loader>
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
                                                            return <Col md={4}>
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
                                        height: '470px'
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
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <div className="title">
                                                            <b style={{
                                                                color: this.state.data.brand_name < 10
                                                                    ? '#f50313'
                                                                    : '#ccc'
                                                            }}>{this.state.data.brand_name}</b>{' '}characters</div>
                                                          <ControlLabel>Brand name</ControlLabel>
                                                        <InputGroup>
                                                            <FormControl type="text" onDragOver={this.preventDefault} onDrop={this.dropWord} data-type="brand_name" data-keypress="dashboard" placeholder="Title - 4 to 8 words is best" onChange={this.handleChangeForms} value={this.state.template.brand_name}/>
                                                            <CopyToClipboard text={this.state.template.brand_name} onCopy={() => this.setState({copied: true})}>
                                                                <InputGroup.Addon>
                                                                    <span className="ion-clipboard"></span>
                                                                </InputGroup.Addon>
                                                            </CopyToClipboard>
                                                        </InputGroup>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
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
                                                        <div className="title">
                                                            <b style={{
                                                                color: this.state.data.tags < 10
                                                                    ? '#f50313'
                                                                    : '#ccc'
                                                            }}>{this.state.data.tags}</b>{' '}characters</div>
                                                          <ControlLabel>Description Bullet Point 1</ControlLabel>
                                                        <InputGroup>
                                                            <FormControl componentClass="textarea" rows={6} onDragOver={this.preventDefault} onDrop={this.dropWord} data-type="tags" data-keypress="dashboard" placeholder="Add description" onChange={this.handleChangeForms} value={this.state.template.tags}/>
                                                            <CopyToClipboard text={this.state.template.tags} onCopy={() => this.setState({copied: true})}>
                                                                <InputGroup.Addon>
                                                                    <span className="ion-clipboard"></span>
                                                                </InputGroup.Addon>
                                                            </CopyToClipboard>
                                                        </InputGroup>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <div className="title">
                                                            <b style={{
                                                                color: this.state.data.main_tags < 10
                                                                    ? '#f50313'
                                                                    : '#ccc'
                                                            }}>{this.state.data.main_tags}</b>{' '}characters</div>
                                                          <ControlLabel>Description Bullet Point 2</ControlLabel>
                                                        <InputGroup>
                                                            <FormControl componentClass="textarea" rows={6} onDragOver={this.preventDefault} onDrop={this.dropWord} data-type="main_tags" data-keypress="dashboard" placeholder="Add description" onChange={this.handleChangeForms} value={this.state.template.main_tags}/>
                                                            <CopyToClipboard text={this.state.template.main_tags} onCopy={() => this.setState({copied: true})}>
                                                                <InputGroup.Addon>
                                                                    <span className="ion-clipboard"></span>
                                                                </InputGroup.Addon>
                                                            </CopyToClipboard>
                                                        </InputGroup>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={12}>
                                                    <FormGroup>
                                                        <div className="description">
                                                            <b style={{
                                                                color: this.state.data.description < 10
                                                                    ? '#f50313'
                                                                    : '#ccc'
                                                            }}>{this.state.data.description}</b>{' '}characters</div>
                                                          <ControlLabel>Description Box</ControlLabel>
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
                                            </Row>
                                        </Loader>
                                    </Panel>

                                </Col>
                            </Row>
                        </Col>
                        <Col md={3}>
                            {this.state.progress > 20 && this.state.progress < 99
                            ? <ProgressBar active now={this.state.progress} label={`${this.state.progress}%`} />
                            : null}
                            <Panel header="Amazon Auto Suggest + Google Search Traffic" className="suggestions-block" style={{
                                height: '815px'
                            }}>
                                <Loader loaded={this.state.loadedKeywords}>
                                    {this.state.stats.length == 0
                                        ? <div className="text-center">Use different keywords.</div>
                                        : null}
                                    {this.state.stats.length > 0
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
                        </Col>
                    </Row>
                </div>
                <Row id="footer">
                    <Col md={12}>
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
