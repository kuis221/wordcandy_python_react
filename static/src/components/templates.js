import React, {Component} from 'react';
import {
    Modal,
    Form,
    FormGroup,
    FormControl,
    Button,
    Alert,
    Row,
    Col,
    ControlLabel,
    InputGroup
} from 'react-bootstrap';
import ReactDOM from 'react-dom';

export default class Templates extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            shopName: '',
            newValidate: {
                name: 60,
                brand_name: 90,
                title: 90,
                description: 256,
                tags: 256,
                main_tags: 256
            },
            newData: {
                name: 60,
                brand_name: 90,
                title: 90,
                description: 256,
                tags: 256,
                main_tags: 256
            },
            newTemplate: {
                name: '',
                brand_name: '',
                title: '',
                description: '',
                tags: '',
                main_tags: ''
            }
        };
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.handleForms = this.handleForms.bind(this);
        this.create = this.create.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    componentWillMount() {
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    create(e) {
        this.setState({modal: false});
        var data = this.state.newTemplate;
        data['shop'] = this.props.shop + 1;
        this.props.newTemplate(data);
    }

    handleKeyDown(event) {
        if (event.keyCode == 13 && event.target.getAttribute('data-keypress') == 'modal') {
            var attr = event.target.getAttribute('data-type');
            var template = this.state.newTemplate;
            template[attr] = event.target.value + ' [______] ';
            if (this.state.newValidate[attr] - event.target.value.length > 0) {
                var data = this.state.newData;
                data[attr] = this.state.newValidate[attr] - template[attr].length;
                this.setState({newTemplate: template, newData: data});
            }
            event.preventDefault();
            return false;
        }
    }

    closeModal() {
        this.setState({modal: false});
    }

    openModal() {
        this.setState({
            modal: true,
            shopName: this.props.shops[this.props.shop].name
        });
    }

    handleForms(event) {
        var template = this.state.newTemplate;
        template[event.target.getAttribute('data-type')] = event.target.value;
        var data = this.state.newData;
        data[event.target.getAttribute('data-type')] = this.state.newValidate[event.target.getAttribute('data-type')] - event.target.value.length;
        this.setState({newTemplate: template, newData: data});
    }

    render() {
        return (
            <div className="static-modal">
                <div>
                    <Button bsStyle="primary" onClick={this.openModal}>+ New</Button>
                </div>
                <Modal show={this.state.modal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>New template for {this.state.shopName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="new-template">
                        <Row style={{
                            paddingLeft: '10px',
                            paddingRight: '10px',
                            paddingBottom: '10px'
                        }}>
                            <Col md={12}>
                                <Row className="forms">
                                    <Col md={12} style={{
                                        paddingTop: '10px',
                                        paddingBottom: '10px'
                                    }}>
                                        <div className="validate">
                                            <b style={{
                                                color: this.state.newData.name < 10
                                                    ? '#f50313'
                                                    : '#ccc'
                                            }}>{this.state.newData.name}</b>{' '}characters</div>
                                        <label className="control-label">Template name</label>
                                        <FormControl type="text" placeholder="Template name" onChange={this.handleForms} data-type="name" value={this.state.newTemplate.name}/>
                                    </Col>
                                    <Col md={12} style={{
                                        paddingBottom: '10px'
                                    }}>
                                        <div className="validate">
                                            <b style={{
                                                color: this.state.newData.brand_name < 10
                                                    ? '#f50313'
                                                    : '#ccc'
                                            }}>{this.state.newData.brand_name}</b>{' '}characters</div>
                                        <label className="control-label">Brand name</label>
                                        <FormControl type="text" placeholder="Brand name" onChange={this.handleForms} data-keypress="modal" data-type="brand_name" value={this.state.newTemplate.brand_name}/>
                                    </Col>
                                    <Col md={12} style={{
                                        paddingBottom: '10px'
                                    }}>
                                        <div className="validate">
                                            <b style={{
                                                color: this.state.newData.title < 10
                                                    ? '#f50313'
                                                    : '#ccc'
                                            }}>{this.state.newData.title}</b>{' '}characters</div>
                                        <label className="control-label">Title</label>
                                        <FormControl type="text" placeholder="Title - 4 to 8 words is best" onChange={this.handleForms} data-keypress="modal" data-type="title" value={this.state.newTemplate.title}/>
                                    </Col>
                                    <Col md={12} style={{
                                        paddingBottom: '10px'
                                    }}>
                                        <div className="validate">
                                            <b style={{
                                                color: this.state.newData.tags < 10
                                                    ? '#f50313'
                                                    : '#ccc'
                                            }}>{this.state.newData.tags}</b>{' '}characters</div>
                                          <label className="control-label">Description Bullet Point 2</label>
                                        <FormControl type="text" placeholder="Add description" onChange={this.handleForms} data-keypress="modal" data-type="tags" value={this.state.newTemplate.tags}/>
                                    </Col>

                                    <Col md={12} style={{
                                        paddingBottom: '10px'
                                    }}>
                                        <div className="validate">
                                            <b style={{
                                                color: this.state.newData.main_tags < 10
                                                    ? '#f50313'
                                                    : '#ccc'
                                            }}>{this.state.newData.main_tags}</b>{' '}characters</div>
                                        <label className="control-label">Description Bullet Point 1</label>
                                        <FormControl type="text" placeholder="Add description" onChange={this.handleForms} data-keypress="modal" data-type="main_tags" value={this.state.newTemplate.main_tags}/>
                                    </Col>
                                    <Col md={12} style={{
                                        paddingBottom: '10px'
                                    }}>
                                        <div className="validate">
                                            <b>{this.state.newData.description}</b>{' '}characters</div>
                                        <label className="control-label">Description Box</label>
                                        <FormControl componentClass="textarea" placeholder="Dref description of work to get your audience all excited" onChange={this.handleForms} data-keypress="modal" data-type="description" value={this.state.newTemplate.description}/>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12} className="text-right">
                                <Button bsStyle="primary" onClick={this.create} disabled={this.state.newTemplate.name.length == 0}>Create</Button>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}
