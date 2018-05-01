webpackHotUpdate(0,{

/***/ 650:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _stringify = __webpack_require__(239);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _getPrototypeOf = __webpack_require__(49);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(4);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(50);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(6);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(5);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _reactBootstrap = __webpack_require__(60);

	var _reactRouter = __webpack_require__(73);

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactTagsinput = __webpack_require__(1250);

	var _reactTagsinput2 = _interopRequireDefault(_reactTagsinput);

	var _reactDropzone = __webpack_require__(1218);

	var _reactDropzone2 = _interopRequireDefault(_reactDropzone);

	var _axios = __webpack_require__(236);

	var _axios2 = _interopRequireDefault(_axios);

	var _reactLoader = __webpack_require__(83);

	var _reactLoader2 = _interopRequireDefault(_reactLoader);

	var _stringFormat = __webpack_require__(551);

	var _stringFormat2 = _interopRequireDefault(_stringFormat);

	var _lodash = __webpack_require__(467);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _reactToggle = __webpack_require__(545);

	var _reactToggle2 = _interopRequireDefault(_reactToggle);

	var _reactCopyToClipboard = __webpack_require__(507);

	var _reactCopyToClipboard2 = _interopRequireDefault(_reactCopyToClipboard);

	var _auth = __webpack_require__(167);

	var _auth2 = _interopRequireDefault(_auth);

	var _dashboard = __webpack_require__(238);

	var _profiles = __webpack_require__(78);

	var _templates = __webpack_require__(646);

	var _templates2 = _interopRequireDefault(_templates);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Dashboard = function (_MixinAuth) {
	    (0, _inherits3.default)(Dashboard, _MixinAuth);

	    function Dashboard(props) {
	        (0, _classCallCheck3.default)(this, Dashboard);

	        var _this = (0, _possibleConstructorReturn3.default)(this, (Dashboard.__proto__ || (0, _getPrototypeOf2.default)(Dashboard)).call(this, props));

	        var user = JSON.parse(localStorage.getItem("user"));
	        _this.state = {
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
	        _this.onUploadImage = _this.onUploadImage.bind(_this);
	        _this.calculate = _this.calculate.bind(_this);
	        _this.exportTemplates = _this.exportTemplates.bind(_this);
	        _this.handleShop = _this.handleShop.bind(_this);
	        _this.handleTemplate = _this.handleTemplate.bind(_this);
	        _this.reset = _this.reset.bind(_this);
	        _this.resetKeywords = _this.resetKeywords.bind(_this);
	        _this.addWord = _this.addWord.bind(_this);
	        _this.handleChangeForms = _this.handleChangeForms.bind(_this);
	        _this.handleThumbnailChange = _this.handleThumbnailChange.bind(_this);
	        _this.exportKeywords = _this.exportKeywords.bind(_this);
	        _this.handleSuggests = _this.handleSuggests.bind(_this);
	        _this.dragWordStart = _this.dragWordStart.bind(_this);
	        _this.dropWord = _this.dropWord.bind(_this);
	        _this.preventDefault = _this.preventDefault.bind(_this);
	        _this.newTemplate = _this.newTemplate.bind(_this);
	        _this.handleKeyDown = _this.handleKeyDown.bind(_this);
	        _this.handleKeyPress = _this.handleKeyPress.bind(_this);
	        return _this;
	    }

	    (0, _createClass3.default)(Dashboard, [{
	        key: 'componentWillMount',
	        value: function componentWillMount() {
	            document.addEventListener("keydown", this.handleKeyDown.bind(this));
	            document.addEventListener("keyup", this.handleKeyPress.bind(this));
	            document.body.style.backgroundColor = "#454656";
	        }
	    }, {
	        key: 'handleKeyDown',
	        value: function handleKeyDown(event) {
	            if (event.keyCode == 13 && event.target.getAttribute('data-keypress') == 'dashboard') {
	                var attr = event.target.getAttribute('data-type');
	                var template = this.state.template;
	                template[attr] = event.target.value + ' [______] ';
	                if (this.state.validate[attr] - event.target.value.length > 0) {
	                    var data = this.state.data;
	                    data[attr] = this.state.validate[attr] - template[attr].length;
	                    this.setState({ template: template, data: data });
	                }
	                event.preventDefault();
	                return false;
	            }
	        }
	    }, {
	        key: 'handleKeyPress',
	        value: function handleKeyPress(event) {
	            if (event.keyCode == 8 && event.target.getAttribute('data-keypress') == 'dashboard') {
	                var attr = event.target.getAttribute('data-type');
	                var template = this.state.template;
	                template[attr] = event.target.value.replace(' [______ ', '');
	                if (this.state.validate[attr] - event.target.value.length > 0) {
	                    var data = this.state.data;
	                    data[attr] = this.state.validate[attr] - template[attr].length;
	                    this.setState({ template: template, data: data });
	                }
	                event.preventDefault();
	                return false;
	            }
	        }
	    }, {
	        key: 'newTemplate',
	        value: function newTemplate(data) {
	            var _ = this;
	            _.setState({ loadedTemplates: false });
	            _dashboard.apiDashboard.newTemplates(data).then(function (response) {
	                var templates = _.state.templates;
	                templates.push(response.data);
	                _.setState({ loadedTemplates: true, templates: templates });
	            });
	        }
	    }, {
	        key: 'preventDefault',
	        value: function preventDefault(event) {
	            event.preventDefault();
	        }
	    }, {
	        key: 'resetKeywords',
	        value: function resetKeywords(event) {
	            this.setState({ tags: [] });
	        }
	    }, {
	        key: 'dropWord',
	        value: function dropWord(event) {
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
	                this.setState({ data: data });
	                this.setState({ template: template });
	            }
	        }
	    }, {
	        key: 'handleSuggests',
	        value: function handleSuggests(key) {
	            this.setState({ suggestIndex: key });
	        }
	    }, {
	        key: 'dragWordStart',
	        value: function dragWordStart(event) {
	            event.dataTransfer.setData('word', event.target.getAttribute('data-word'));
	        }
	    }, {
	        key: 'handleThumbnailChange',
	        value: function handleThumbnailChange() {
	            this.setState({
	                thumbnailStatus: !this.state.thumbnailStatus
	            });
	            if (this.state.thumbnailStatus) {
	                this.setState({ thumbnailBackground: '#e1e0f0' });
	            } else {
	                this.setState({ thumbnailBackground: '#56576c' });
	            }
	        }
	    }, {
	        key: 'reset',
	        value: function reset() {
	            this.setState({ tags: [], similars: [], stats: [], thumbnail: '/static/images/dashboard/shirt.png' });
	        }
	    }, {
	        key: 'addWord',
	        value: function addWord(event) {
	            var template = this.state.template;
	            template.title = template.title.replace('[______]', event.target.getAttribute('data-word'));
	            template.description = template.description.replace('[______]', event.target.getAttribute('data-word'));
	            template.tags = template.tags.replace('[______]', event.target.getAttribute('data-word'));
	            template.main_tags = template.main_tags.replace('[______]', event.target.getAttribute('data-word'));
	            this.setState({ template: template });

	            var data = this.state.data;
	            var fields = ['title', 'brand_name', 'description', 'tags', 'main_tags'];
	            for (var i = 0; i < fields.length; i++) {
	                data[fields[i]] = this.state.validate[fields[i]] - template[fields[i]].length;
	            }
	            this.setState({ data: data });
	        }
	    }, {
	        key: 'handleChangeForms',
	        value: function handleChangeForms(event) {
	            var template = this.state.template;
	            var value = event.target.value;
	            template[event.target.getAttribute('data-type')] = value;
	            this.setState({ template: template });

	            var data = this.state.data;
	            data[event.target.getAttribute('data-type')] = this.state.validate[event.target.getAttribute('data-type')] - value.length;
	            this.setState({ data: data });
	        }
	    }, {
	        key: 'handleShop',
	        value: function handleShop(index) {
	            var template = this.state.shops[index].templates[0];
	            var data = this.state.data;
	            data.title = this.state.validate.title - template.title.length;
	            data.description = this.state.validate.description - template.description.length;
	            data.tags = this.state.validate.tags - template.tags.length;
	            data.main_tags = this.state.validate.main_tags - template.main_tags.length;
	            this.setState({ activeShop: index, templates: this.state.shops[index].templates, activeTemplate: 0, data: data, template: this.state.shops[index].templates[0] });
	        }
	    }, {
	        key: 'handleTemplate',
	        value: function handleTemplate(event) {
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
	    }, {
	        key: 'handleChangeTags',
	        value: function handleChangeTags(tags) {
	            this.setState({ tags: tags });
	        }
	    }, {
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            var _ = this;
	            _profiles.apiProfiles.getUser().then(function (response) {
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
	                        localStorage.setItem("user", (0, _stringify2.default)(response.data));
	                        break;
	                    case 401:
	                        _reactRouter.browserHistory.push('/sign-in');
	                        break;
	                }
	            }).catch(function (error) {});

	            _.setState({ loadedTemplates: false });
	            _dashboard.apiDashboard.templates().then(function (response) {
	                var data = _.state.data;
	                var template = response.data[0].templates[0];
	                data.title = _.state.validate.title - template.title.length;
	                data.description = _.state.validate.description - template.description.length;
	                data.tags = _.state.validate.tags - template.tags.length;
	                data.main_tags = _.state.validate.main_tags - template.main_tags.length;

	                _.setState({ shops: response.data, templates: response.data[0].templates, template: template, data: data, loadedTemplates: true });
	            }).catch(function (error) {});
	        }
	    }, {
	        key: 'onUploadImage',
	        value: function onUploadImage(files) {
	            var _ = this;
	            var file = files[0];
	            var reader = new FileReader();
	            reader.onload = function (event) {
	                _.setState({ imageBase64: event.target.result });
	            };
	            reader.readAsDataURL(file);

	            this.setState({ thumbnail: files[0]['preview']
	            });
	        }
	    }, {
	        key: 'exportTemplates',
	        value: function exportTemplates() {
	            var _ = this;
	            _.setState({ loadedExport: false });
	            var data = {
	                'title': this.state.template.title,
	                'brand_name': this.state.template.brand_name,
	                'description': this.state.template.description,
	                'tags': this.state.template.tags,
	                'main_tags': this.state.template.main_tags,
	                'keywords': this.state.tags.toString()
	            };
	            if (this.state.imageBase64.length > 0) {
	                data['photo'] = this.state.imageBase64;
	            }
	            _dashboard.apiDashboard.exportTemplates(data).then(function (response) {
	                _.setState({ loadedExport: true });
	                window.location = response.data['file'];
	            });
	        }
	    }, {
	        key: 'exportKeywords',
	        value: function exportKeywords() {
	            var _ = this;
	            _.setState({ loadedExport: false });
	            var data = {
	                'keywords': (0, _stringify2.default)(_.state.stats)
	            };
	            _dashboard.apiDashboard.exportKeywords(data).then(function (response) {
	                _.setState({ loadedExport: true });
	                window.location = response.data['file'];
	            });
	        }
	    }, {
	        key: 'keywordtool',
	        value: function keywordtool(_, i) {
	            var data = {
	                'params': {
	                    'tags': _.state.tags[i],
	                    'format': 'json'
	                }
	            };

	            _dashboard.apiDashboard.keywordtool(data).then(function (response) {
	                var keywords = _.state.keywords;
	                var sortKeywords = _lodash2.default.sortBy(response.data.keywords, 'volume').reverse();
	                keywords.push(sortKeywords);
	                _.setState({ keywords: keywords });

	                var stats = _.state.stats.concat(response.data.keywords);
	                stats = _lodash2.default.sortBy(stats, 'volume').reverse();
	                _.setState({ stats: stats });

	                var stats = _.state.stats;

	                var words = '';
	                for (var index = 0; index < _.state.stats.length; index++) {
	                    words += (index == 0 ? '' : ',') + _.state.stats[index].name;
	                }
	                var data = {
	                    'words': words
	                };
	                _dashboard.apiDashboard.trademarks(data).then(function (response) {
	                    for (var j = 0; j < response.data.length; j++) {
	                        if (response.data[j].count > 0) {
	                            stats[j]['trademark'] = true;
	                        }
	                    }
	                    _.setState({ stats: stats });
	                });

	                var keywordsTitle = _.state.keywordsTitle;
	                keywordsTitle.push(_.state.tags[i]);
	                _.setState({ keywordsTitle: keywordsTitle });

	                _.setState({ loadedKeywords: true });
	                _.setState({
	                    progress: Math.round(100 / (_.state.tags.length - i))
	                });

	                if (_.state.progress > 99) {
	                    setTimeout(function () {
	                        _.setState({ progressShow: false });
	                    }, 2000);
	                }

	                i++;
	                if (i < _.state.tags.length) {
	                    _.keywordtool(_, i);
	                }
	            });
	        }
	    }, {
	        key: 'calculate',
	        value: function calculate() {
	            var _ = this;
	            var data = {
	                'params': {
	                    'tags': _.state.tags.toString(),
	                    'format': 'json'
	                }
	            };
	            var print = 0;
	            if (_.state.vip == false) {
	                print = _.state.print - 1;
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

	            _dashboard.apiDashboard.synonyms(data).then(function (response) {
	                console.log(data, response);
	                var similars = response.data.synonyms;
	                _.setState({ similars: similars });
	                _dashboard.apiDashboard.antonyms(data).then(function (response) {
	                    similars.concat(response.data.antonyms);
	                    _.setState({ similars: similars });
	                    _.setState({ loadedSimilars: true });
	                    _.setState({ stats: [] });
	                    _.keywordtool(_, 0);
	                });
	            });
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this2 = this;

	            var exportWindow = _react2.default.createElement(
	                _reactBootstrap.Popover,
	                { className: 'export-list' },
	                _react2.default.createElement(
	                    'ul',
	                    { className: 'list-inline' },
	                    _react2.default.createElement(
	                        'li',
	                        null,
	                        _react2.default.createElement(
	                            _reactBootstrap.Button,
	                            { bsStyle: 'primary', onClick: this.exportKeywords },
	                            'Keywords'
	                        )
	                    ),
	                    _react2.default.createElement(
	                        'li',
	                        null,
	                        _react2.default.createElement(
	                            _reactBootstrap.Button,
	                            { bsStyle: 'primary', onClick: this.exportTemplates },
	                            'Templates'
	                        )
	                    )
	                )
	            );

	            var limitWindow = _react2.default.createElement(
	                _reactBootstrap.Popover,
	                null,
	                _react2.default.createElement(
	                    'p',
	                    null,
	                    'You have Plan you can do 200 calculations a day.'
	                )
	            );

	            var limitWindowFree = _react2.default.createElement(
	                _reactBootstrap.Popover,
	                null,
	                _react2.default.createElement(
	                    'p',
	                    null,
	                    'You have ',
	                    _react2.default.createElement(
	                        'b',
	                        null,
	                        '"Free" Plan'
	                    ),
	                    ' you can do 1 calculation a day. Please ',
	                    _react2.default.createElement(
	                        'a',
	                        { href: '/payments/' },
	                        'Upgrade plan'
	                    ),
	                    '.'
	                )
	            );

	            return _react2.default.createElement(
	                _reactBootstrap.Grid,
	                { className: 'dashboard-page', fluid: true },
	                _react2.default.createElement(
	                    _reactBootstrap.Navbar,
	                    null,
	                    _react2.default.createElement(
	                        _reactBootstrap.Navbar.Header,
	                        null,
	                        _react2.default.createElement(
	                            _reactBootstrap.Navbar.Brand,
	                            null,
	                            _react2.default.createElement(
	                                _reactRouter.Link,
	                                { className: 'logo', to: '/dashboard/' },
	                                _react2.default.createElement(_reactBootstrap.Image, { style: { width: '170px' }, src: '/static/images/logo.png' })
	                            )
	                        )
	                    ),
	                    _react2.default.createElement(
	                        _reactBootstrap.Nav,
	                        null,
	                        _react2.default.createElement(
	                            _reactBootstrap.MenuItem,
	                            { href: '/dashboard/', className: 'active' },
	                            'Dashboard'
	                        ),
	                        _react2.default.createElement(
	                            _reactBootstrap.MenuItem,
	                            { href: '/research-page/' },
	                            'Research'
	                        ),
	                        _react2.default.createElement(
	                            _reactBootstrap.MenuItem,
	                            { href: '/keyword-suggestions/' },
	                            'Keywords'
	                        )
	                    ),
	                    _react2.default.createElement(
	                        _reactBootstrap.Nav,
	                        { pullRight: true },
	                        _react2.default.createElement(
	                            _reactBootstrap.NavDropdown,
	                            { title: this.state.username, id: 'basic-nav-dropdown' },
	                            _react2.default.createElement(
	                                _reactBootstrap.MenuItem,
	                                { disabled: true },
	                                'Dashboard'
	                            ),
	                            _react2.default.createElement(
	                                _reactBootstrap.MenuItem,
	                                { href: '/profile/' },
	                                'Settings'
	                            ),
	                            _react2.default.createElement(
	                                _reactBootstrap.MenuItem,
	                                { href: '/research-page/' },
	                                'Research page'
	                            ),
	                            _react2.default.createElement(_reactBootstrap.MenuItem, { divider: true }),
	                            _react2.default.createElement(
	                                _reactBootstrap.MenuItem,
	                                { href: '/' },
	                                'Exit'
	                            )
	                        )
	                    )
	                ),
	                _react2.default.createElement(
	                    'div',
	                    { className: 'container' },
	                    _react2.default.createElement(
	                        _reactBootstrap.Row,
	                        { className: 'dashboard-content' },
	                        _react2.default.createElement(
	                            _reactBootstrap.Col,
	                            { md: 9 },
	                            _react2.default.createElement(
	                                _reactBootstrap.Row,
	                                null,
	                                _react2.default.createElement(
	                                    _reactBootstrap.Col,
	                                    { md: 4 },
	                                    _react2.default.createElement(
	                                        _reactBootstrap.Panel,
	                                        { className: 'photo-block text-center', style: {
	                                                height: '335px'
	                                            } },
	                                        _react2.default.createElement(_reactToggle2.default, { defaultChecked: this.state.thumbnailStatus, icons: {
	                                                checked: _react2.default.createElement('span', { className: 'ion-ios-sunny toogle-sunny' }),
	                                                unchecked: _react2.default.createElement('span', { className: 'ion-ios-moon toogle-moon' })
	                                            }, onChange: this.handleThumbnailChange }),
	                                        _react2.default.createElement(
	                                            'p',
	                                            { style: {
	                                                    backgroundColor: this.state.thumbnailBackground
	                                                } },
	                                            _react2.default.createElement(_reactBootstrap.Image, { src: this.state.thumbnail, width: 250, height: 250 })
	                                        ),
	                                        _react2.default.createElement(
	                                            _reactDropzone2.default,
	                                            { onDrop: this.onUploadImage, multiple: false, rejectStyle: true },
	                                            _react2.default.createElement(
	                                                _reactBootstrap.Button,
	                                                { bsStyle: 'primary', block: true },
	                                                _react2.default.createElement('i', { className: 'icon ion-arrow-up-c' }),
	                                                'Upload image (.jpg / .png)'
	                                            )
	                                        )
	                                    )
	                                ),
	                                _react2.default.createElement(
	                                    _reactBootstrap.Col,
	                                    { md: 8 },
	                                    _react2.default.createElement(
	                                        _reactBootstrap.Row,
	                                        null,
	                                        _react2.default.createElement(
	                                            _reactBootstrap.Col,
	                                            { md: 12, className: 'keywords' },
	                                            _react2.default.createElement(
	                                                _reactBootstrap.Panel,
	                                                { header: 'What keywords descript this t-shirt?', style: {
	                                                        height: 155
	                                                    } },
	                                                _react2.default.createElement(
	                                                    _reactBootstrap.Form,
	                                                    { inline: true },
	                                                    _react2.default.createElement(
	                                                        _reactBootstrap.Row,
	                                                        null,
	                                                        _react2.default.createElement(
	                                                            _reactBootstrap.Col,
	                                                            { md: 12 },
	                                                            _react2.default.createElement(
	                                                                _reactBootstrap.FormGroup,
	                                                                { controlId: 'formControlsTextarea', style: {
	                                                                        'width': '100%'
	                                                                    } },
	                                                                _react2.default.createElement(_reactTagsinput2.default, { maxTags: 4, value: this.state.tags, onChange: this.handleChangeTags.bind(this) })
	                                                            )
	                                                        ),
	                                                        _react2.default.createElement(
	                                                            _reactBootstrap.Col,
	                                                            { md: 12, className: 'actions' },
	                                                            _react2.default.createElement(
	                                                                _reactLoader2.default,
	                                                                { loaded: this.state.loadedPlan },
	                                                                _react2.default.createElement(
	                                                                    _reactBootstrap.Row,
	                                                                    null,
	                                                                    _react2.default.createElement(
	                                                                        _reactBootstrap.Col,
	                                                                        { md: 5, className: 'text-left' },
	                                                                        _react2.default.createElement(
	                                                                            'a',
	                                                                            { disabled: this.state.tags.length == 0, className: 'reset-keywords btn btn-outline', onClick: this.resetKeywords },
	                                                                            _react2.default.createElement('i', { className: 'icon ion-backspace' }),
	                                                                            'Reset Keywords'
	                                                                        )
	                                                                    ),
	                                                                    _react2.default.createElement(
	                                                                        _reactBootstrap.Col,
	                                                                        { md: 4, className: 'text-right limit' },
	                                                                        !this.state.vip ? _react2.default.createElement(
	                                                                            'span',
	                                                                            null,
	                                                                            this.state.active ? _react2.default.createElement(
	                                                                                _reactBootstrap.OverlayTrigger,
	                                                                                { trigger: 'click', placement: 'bottom', overlay: limitWindow },
	                                                                                _react2.default.createElement(
	                                                                                    'p',
	                                                                                    null,
	                                                                                    _react2.default.createElement(
	                                                                                        'b',
	                                                                                        null,
	                                                                                        this.state.print
	                                                                                    ),
	                                                                                    ' listings left ',
	                                                                                    _react2.default.createElement(
	                                                                                        'a',
	                                                                                        { href: '#' },
	                                                                                        _react2.default.createElement('span', { className: 'icon ion-ios-help-outline' })
	                                                                                    )
	                                                                                )
	                                                                            ) : null,
	                                                                            !this.state.active ? _react2.default.createElement(
	                                                                                _reactBootstrap.OverlayTrigger,
	                                                                                { trigger: 'click', placement: 'bottom', overlay: limitWindowFree },
	                                                                                _react2.default.createElement(
	                                                                                    'p',
	                                                                                    null,
	                                                                                    _react2.default.createElement(
	                                                                                        'b',
	                                                                                        null,
	                                                                                        this.state.print
	                                                                                    ),
	                                                                                    ' listing left ',
	                                                                                    _react2.default.createElement(
	                                                                                        'a',
	                                                                                        { href: '#' },
	                                                                                        _react2.default.createElement('span', { className: 'icon ion-ios-help-outline' })
	                                                                                    )
	                                                                                )
	                                                                            ) : null
	                                                                        ) : null
	                                                                    ),
	                                                                    _react2.default.createElement(
	                                                                        _reactBootstrap.Col,
	                                                                        { md: 3, className: 'text-right' },
	                                                                        this.state.print > 0 ? _react2.default.createElement(
	                                                                            _reactBootstrap.Button,
	                                                                            { disabled: this.state.tags.length == 0, className: "animated infinite " + (this.state.tags.length == 0 ? '' : 'pulse'), bsStyle: 'primary', onClick: this.calculate },
	                                                                            _react2.default.createElement('i', { className: 'icon ion-calculator' }),
	                                                                            'Calculate'
	                                                                        ) : null
	                                                                    )
	                                                                )
	                                                            )
	                                                        )
	                                                    )
	                                                )
	                                            )
	                                        ),
	                                        _react2.default.createElement(
	                                            _reactBootstrap.Col,
	                                            { md: 12, className: 'similars' },
	                                            _react2.default.createElement(
	                                                _reactBootstrap.Panel,
	                                                { header: 'Synonyms / Antonyms', style: {
	                                                        height: 170
	                                                    } },
	                                                _react2.default.createElement(
	                                                    _reactLoader2.default,
	                                                    { loaded: this.state.loadedSimilars },
	                                                    _react2.default.createElement(
	                                                        _reactBootstrap.Row,
	                                                        null,
	                                                        this.state.similars.length == 0 ? _react2.default.createElement(
	                                                            'div',
	                                                            { style: {
	                                                                    paddingLeft: '15px'
	                                                                }, className: 'text-center' },
	                                                            'Use different keywords.'
	                                                        ) : null,
	                                                        this.state.similars.map(function (item, i) {
	                                                            return _react2.default.createElement(
	                                                                _reactBootstrap.Col,
	                                                                { md: 4 },
	                                                                _react2.default.createElement('button', { className: 'ion-plus plus-button', onClick: this.addWord, 'data-word': item }),
	                                                                _react2.default.createElement(
	                                                                    'span',
	                                                                    { draggable: 'true', className: 'btn-container', onDragStart: this.dragWordStart, style: {
	                                                                            cursor: 'move'
	                                                                        }, 'data-word': item },
	                                                                    item
	                                                                )
	                                                            );
	                                                        }, this)
	                                                    )
	                                                )
	                                            )
	                                        )
	                                    )
	                                )
	                            ),
	                            _react2.default.createElement(
	                                _reactBootstrap.Row,
	                                { style: {
	                                        paddingBottom: 10
	                                    } },
	                                _react2.default.createElement(
	                                    _reactBootstrap.Col,
	                                    { md: 12 },
	                                    _react2.default.createElement(
	                                        _reactBootstrap.Panel,
	                                        { style: {
	                                                height: '470px'
	                                            } },
	                                        _react2.default.createElement(
	                                            _reactLoader2.default,
	                                            { loaded: this.state.loadedTemplates },
	                                            _react2.default.createElement(
	                                                _reactBootstrap.Row,
	                                                null,
	                                                _react2.default.createElement(
	                                                    _reactBootstrap.Col,
	                                                    { md: 12, className: 'templates-list' },
	                                                    _react2.default.createElement(
	                                                        _reactBootstrap.Nav,
	                                                        { bsStyle: 'tabs', activeKey: this.state.activeShop, onSelect: this.handleShop },
	                                                        this.state.shops.map(function (item, i) {
	                                                            return _react2.default.createElement(
	                                                                _reactBootstrap.NavItem,
	                                                                { eventKey: i },
	                                                                item.name
	                                                            );
	                                                        }, this)
	                                                    )
	                                                )
	                                            ),
	                                            _react2.default.createElement(
	                                                _reactBootstrap.Row,
	                                                { className: 'templates' },
	                                                _react2.default.createElement(
	                                                    _reactBootstrap.Col,
	                                                    { md: 12 },
	                                                    _react2.default.createElement(
	                                                        'div',
	                                                        { className: 'templates' },
	                                                        _react2.default.createElement(
	                                                            'b',
	                                                            null,
	                                                            'Templates'
	                                                        )
	                                                    ),
	                                                    _react2.default.createElement(
	                                                        'ul',
	                                                        { className: 'list-inline' },
	                                                        _react2.default.createElement(
	                                                            'li',
	                                                            null,
	                                                            _react2.default.createElement(_templates2.default, { shop: this.state.activeShop, shops: this.state.shops, newTemplate: this.newTemplate })
	                                                        ),
	                                                        this.state.templates.map(function (item, i) {
	                                                            return _react2.default.createElement(
	                                                                'li',
	                                                                null,
	                                                                _react2.default.createElement(
	                                                                    _reactBootstrap.Button,
	                                                                    { onClick: this.handleTemplate, 'data-id': i, disabled: i == this.state.activeTemplate },
	                                                                    item.name
	                                                                )
	                                                            );
	                                                        }, this)
	                                                    )
	                                                ),
	                                                _react2.default.createElement(
	                                                    _reactBootstrap.Col,
	                                                    { md: 6 },
	                                                    _react2.default.createElement(
	                                                        _reactBootstrap.FormGroup,
	                                                        null,
	                                                        _react2.default.createElement(
	                                                            'div',
	                                                            { className: 'title' },
	                                                            _react2.default.createElement(
	                                                                'b',
	                                                                { style: {
	                                                                        color: this.state.data.brand_name < 10 ? '#f50313' : '#ccc'
	                                                                    } },
	                                                                this.state.data.brand_name
	                                                            ),
	                                                            ' ',
	                                                            'characters'
	                                                        ),
	                                                        _react2.default.createElement(
	                                                            _reactBootstrap.ControlLabel,
	                                                            null,
	                                                            'Brand name'
	                                                        ),
	                                                        _react2.default.createElement(
	                                                            _reactBootstrap.InputGroup,
	                                                            null,
	                                                            _react2.default.createElement(_reactBootstrap.FormControl, { type: 'text', onDragOver: this.preventDefault, onDrop: this.dropWord, 'data-type': 'brand_name', 'data-keypress': 'dashboard', placeholder: 'Title - 4 to 8 words is best', onChange: this.handleChangeForms, value: this.state.template.brand_name }),
	                                                            _react2.default.createElement(
	                                                                _reactCopyToClipboard2.default,
	                                                                { text: this.state.template.brand_name, onCopy: function onCopy() {
	                                                                        return _this2.setState({ copied: true });
	                                                                    } },
	                                                                _react2.default.createElement(
	                                                                    _reactBootstrap.InputGroup.Addon,
	                                                                    null,
	                                                                    _react2.default.createElement('span', { className: 'ion-clipboard' })
	                                                                )
	                                                            )
	                                                        )
	                                                    )
	                                                ),
	                                                _react2.default.createElement(
	                                                    _reactBootstrap.Col,
	                                                    { md: 6 },
	                                                    _react2.default.createElement(
	                                                        _reactBootstrap.FormGroup,
	                                                        null,
	                                                        _react2.default.createElement(
	                                                            'div',
	                                                            { className: 'title' },
	                                                            _react2.default.createElement(
	                                                                'b',
	                                                                { style: {
	                                                                        color: this.state.data.title < 10 ? '#f50313' : '#ccc'
	                                                                    } },
	                                                                this.state.data.title
	                                                            ),
	                                                            ' ',
	                                                            'characters'
	                                                        ),
	                                                        _react2.default.createElement(
	                                                            _reactBootstrap.ControlLabel,
	                                                            null,
	                                                            'Title'
	                                                        ),
	                                                        _react2.default.createElement(
	                                                            _reactBootstrap.InputGroup,
	                                                            null,
	                                                            _react2.default.createElement(_reactBootstrap.FormControl, { type: 'text', onDragOver: this.preventDefault, onDrop: this.dropWord, 'data-type': 'title', 'data-keypress': 'dashboard', placeholder: 'Title - 4 to 8 words is best', onChange: this.handleChangeForms, value: this.state.template.title }),
	                                                            _react2.default.createElement(
	                                                                _reactCopyToClipboard2.default,
	                                                                { text: this.state.template.title, onCopy: function onCopy() {
	                                                                        return _this2.setState({ copied: true });
	                                                                    } },
	                                                                _react2.default.createElement(
	                                                                    _reactBootstrap.InputGroup.Addon,
	                                                                    null,
	                                                                    _react2.default.createElement('span', { className: 'ion-clipboard' })
	                                                                )
	                                                            )
	                                                        )
	                                                    )
	                                                ),
	                                                _react2.default.createElement(
	                                                    _reactBootstrap.Col,
	                                                    { md: 6 },
	                                                    _react2.default.createElement(
	                                                        _reactBootstrap.FormGroup,
	                                                        null,
	                                                        _react2.default.createElement(
	                                                            'div',
	                                                            { className: 'title' },
	                                                            _react2.default.createElement(
	                                                                'b',
	                                                                { style: {
	                                                                        color: this.state.data.tags < 10 ? '#f50313' : '#ccc'
	                                                                    } },
	                                                                this.state.data.tags
	                                                            ),
	                                                            ' ',
	                                                            'characters'
	                                                        ),
	                                                        _react2.default.createElement(
	                                                            _reactBootstrap.ControlLabel,
	                                                            null,
	                                                            'Description Bullet Point 1'
	                                                        ),
	                                                        _react2.default.createElement(
	                                                            _reactBootstrap.InputGroup,
	                                                            null,
	                                                            _react2.default.createElement(_reactBootstrap.FormControl, { componentClass: 'textarea', rows: 6, onDragOver: this.preventDefault, onDrop: this.dropWord, 'data-type': 'tags', 'data-keypress': 'dashboard', placeholder: 'Add description', onChange: this.handleChangeForms, value: this.state.template.tags }),
	                                                            _react2.default.createElement(
	                                                                _reactCopyToClipboard2.default,
	                                                                { text: this.state.template.tags, onCopy: function onCopy() {
	                                                                        return _this2.setState({ copied: true });
	                                                                    } },
	                                                                _react2.default.createElement(
	                                                                    _reactBootstrap.InputGroup.Addon,
	                                                                    null,
	                                                                    _react2.default.createElement('span', { className: 'ion-clipboard' })
	                                                                )
	                                                            )
	                                                        )
	                                                    )
	                                                ),
	                                                _react2.default.createElement(
	                                                    _reactBootstrap.Col,
	                                                    { md: 6 },
	                                                    _react2.default.createElement(
	                                                        _reactBootstrap.FormGroup,
	                                                        null,
	                                                        _react2.default.createElement(
	                                                            'div',
	                                                            { className: 'title' },
	                                                            _react2.default.createElement(
	                                                                'b',
	                                                                { style: {
	                                                                        color: this.state.data.main_tags < 10 ? '#f50313' : '#ccc'
	                                                                    } },
	                                                                this.state.data.main_tags
	                                                            ),
	                                                            ' ',
	                                                            'characters'
	                                                        ),
	                                                        _react2.default.createElement(
	                                                            _reactBootstrap.ControlLabel,
	                                                            null,
	                                                            'Description Bullet Point 2'
	                                                        ),
	                                                        _react2.default.createElement(
	                                                            _reactBootstrap.InputGroup,
	                                                            null,
	                                                            _react2.default.createElement(_reactBootstrap.FormControl, { componentClass: 'textarea', rows: 6, onDragOver: this.preventDefault, onDrop: this.dropWord, 'data-type': 'main_tags', 'data-keypress': 'dashboard', placeholder: 'Add description', onChange: this.handleChangeForms, value: this.state.template.main_tags }),
	                                                            _react2.default.createElement(
	                                                                _reactCopyToClipboard2.default,
	                                                                { text: this.state.template.main_tags, onCopy: function onCopy() {
	                                                                        return _this2.setState({ copied: true });
	                                                                    } },
	                                                                _react2.default.createElement(
	                                                                    _reactBootstrap.InputGroup.Addon,
	                                                                    null,
	                                                                    _react2.default.createElement('span', { className: 'ion-clipboard' })
	                                                                )
	                                                            )
	                                                        )
	                                                    )
	                                                ),
	                                                _react2.default.createElement(
	                                                    _reactBootstrap.Col,
	                                                    { md: 12 },
	                                                    _react2.default.createElement(
	                                                        _reactBootstrap.FormGroup,
	                                                        null,
	                                                        _react2.default.createElement(
	                                                            'div',
	                                                            { className: 'description' },
	                                                            _react2.default.createElement(
	                                                                'b',
	                                                                { style: {
	                                                                        color: this.state.data.description < 10 ? '#f50313' : '#ccc'
	                                                                    } },
	                                                                this.state.data.description
	                                                            ),
	                                                            ' ',
	                                                            'characters'
	                                                        ),
	                                                        _react2.default.createElement(
	                                                            _reactBootstrap.ControlLabel,
	                                                            null,
	                                                            'Description Box'
	                                                        ),
	                                                        _react2.default.createElement(
	                                                            _reactBootstrap.InputGroup,
	                                                            null,
	                                                            _react2.default.createElement(_reactBootstrap.FormControl, { componentClass: 'textarea', onDragOver: this.preventDefault, onDrop: this.dropWord, 'data-type': 'description', 'data-keypress': 'dashboard', rows: 5, placeholder: 'Dref description of work to get your audience all excited', onChange: this.handleChangeForms, value: this.state.template.description }),
	                                                            _react2.default.createElement(
	                                                                _reactCopyToClipboard2.default,
	                                                                { text: this.state.template.description, onCopy: function onCopy() {
	                                                                        return _this2.setState({ copied: true });
	                                                                    } },
	                                                                _react2.default.createElement(
	                                                                    _reactBootstrap.InputGroup.Addon,
	                                                                    null,
	                                                                    _react2.default.createElement('span', { className: 'ion-clipboard' })
	                                                                )
	                                                            )
	                                                        )
	                                                    )
	                                                )
	                                            )
	                                        )
	                                    )
	                                )
	                            )
	                        ),
	                        _react2.default.createElement(
	                            _reactBootstrap.Col,
	                            { md: 3 },
	                            this.state.progress > 20 && this.state.progress < 99 ? _react2.default.createElement(_reactBootstrap.ProgressBar, { active: true, now: this.state.progress, label: this.state.progress + '%' }) : null,
	                            _react2.default.createElement(
	                                _reactBootstrap.Panel,
	                                { header: 'Amazon Auto Suggest + Google Search Traffic', className: 'suggestions-block', style: {
	                                        height: '815px'
	                                    } },
	                                _react2.default.createElement(
	                                    _reactLoader2.default,
	                                    { loaded: this.state.loadedKeywords },
	                                    this.state.stats.length == 0 ? _react2.default.createElement(
	                                        'div',
	                                        { className: 'text-center' },
	                                        'Use different keywords.'
	                                    ) : null,
	                                    this.state.stats.length > 0 ? _react2.default.createElement(
	                                        'div',
	                                        { className: 'suggestions' },
	                                        _react2.default.createElement(
	                                            _reactBootstrap.Tabs,
	                                            { activeKey: this.state.suggestIndex, animation: false, onSelect: this.handleSuggests },
	                                            this.state.keywords.map(function (keyword, i) {
	                                                return _react2.default.createElement(
	                                                    _reactBootstrap.Tab,
	                                                    { eventKey: i, title: this.state.keywordsTitle[i] },
	                                                    this.state.keywords[i].map(function (item, j) {
	                                                        return _react2.default.createElement(
	                                                            _reactBootstrap.Row,
	                                                            null,
	                                                            _react2.default.createElement(
	                                                                _reactBootstrap.Col,
	                                                                { md: 8 },
	                                                                _react2.default.createElement('button', { className: 'ion-plus plus-button', onClick: this.addWord, 'data-word': item.name }),
	                                                                _react2.default.createElement(
	                                                                    'span',
	                                                                    { draggable: 'true', className: item.trademark ? 'btn-trademark' : 'btn-container', onDragStart: this.dragWordStart, style: {
	                                                                            cursor: 'move'
	                                                                        }, 'data-word': item.name },
	                                                                    item.name
	                                                                )
	                                                            ),
	                                                            _react2.default.createElement(
	                                                                _reactBootstrap.Col,
	                                                                { md: 4, className: 'text-right' },
	                                                                _react2.default.createElement(
	                                                                    'span',
	                                                                    { className: 'volume' },
	                                                                    item.volume
	                                                                )
	                                                            )
	                                                        );
	                                                    }, this)
	                                                );
	                                            }, this)
	                                        )
	                                    ) : null
	                                )
	                            )
	                        )
	                    )
	                ),
	                _react2.default.createElement(
	                    _reactBootstrap.Row,
	                    { id: 'footer' },
	                    _react2.default.createElement(
	                        _reactBootstrap.Col,
	                        { md: 12 },
	                        _react2.default.createElement(
	                            _reactBootstrap.Navbar,
	                            null,
	                            _react2.default.createElement(
	                                _reactBootstrap.Nav,
	                                { style: {
	                                        paddingRight: '20%'
	                                    }, pullLeft: true },
	                                _react2.default.createElement(
	                                    _reactBootstrap.NavItem,
	                                    null,
	                                    _react2.default.createElement(
	                                        _reactLoader2.default,
	                                        { loaded: this.state.loadedExport },
	                                        _react2.default.createElement(
	                                            _reactBootstrap.OverlayTrigger,
	                                            { trigger: 'click', placement: 'top', overlay: exportWindow },
	                                            _react2.default.createElement(
	                                                _reactBootstrap.Button,
	                                                { bsStyle: 'success', disabled: this.state.tags.length == 0 },
	                                                _react2.default.createElement('i', { className: 'icon ion-arrow-down-c' }),
	                                                'Export Data'
	                                            )
	                                        )
	                                    )
	                                ),
	                                _react2.default.createElement(
	                                    _reactBootstrap.NavItem,
	                                    null,
	                                    _react2.default.createElement(
	                                        _reactBootstrap.Button,
	                                        { bsStyle: 'primary', onClick: this.reset },
	                                        _react2.default.createElement('i', { className: 'icon ion-refresh' }),
	                                        'Start Over'
	                                    )
	                                )
	                            )
	                        )
	                    )
	                )
	            );
	        }
	    }]);
	    return Dashboard;
	}(_auth2.default);

	exports.default = Dashboard;

/***/ })

})