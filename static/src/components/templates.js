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
            validate: {
                name: 60,
                title: 90,
                description: 180,
                tags: 60,
                main_tags: 60
            },
            data: {
                name: 60,
                title: 90,
                description: 180,
                tags: 60,
                main_tags: 60
            },
            template: {
                name: '',
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
    }

    create(e) {
      this.setState({modal: false});
      var data = this.state.template;
      data['shop'] = this.props.shop + 1;
      this.props.newTemplate(data);
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
        if (this.state.validate[event.target.getAttribute('data-type')] - event.target.value.length > 0) {
            var template = this.state.template;
            template[event.target.getAttribute('data-type')] = event.target.value;
            var data = this.state.data;
            data[event.target.getAttribute('data-type')] = this.state.validate[event.target.getAttribute('data-type')] - event.target.value.length;
        }
        this.setState({template: template, data: data});
    }

    render() {
        return (
            <div className="static-modal">
                <div>
                    <Button bsStyle="primary" onClick={this.openModal}>+ Add template</Button>
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
                                        <div className="validate"><b>{this.state.data.name}</b>{' '}characters</div>
                                        <label className="control-label">Template name</label>
                                        <FormControl type="text" placeholder="Template name" onChange={this.handleForms} data-type="name" value={this.state.template.name}/>
                                    </Col>
                                    <Col md={12} style={{
                                        paddingBottom: '10px'
                                    }}>
                                        <div className="validate"><b>{this.state.data.title}</b>{' '}characters</div>
                                        <label className="control-label">Title</label>
                                        <FormControl type="text" placeholder="Title - 4 to 8 words is best" onChange={this.handleForms} data-type="title" value={this.state.template.title}/>
                                    </Col>
                                    <Col md={12} style={{
                                        paddingBottom: '10px'
                                    }}>
                                        <div className="validate"><b>{this.state.data.description}</b>{' '}characters</div>
                                        <label className="control-label">Description</label>
                                        <FormControl componentClass="textarea" placeholder="Dref description of work to get your audience all excited" onChange={this.handleForms} data-type="description" value={this.state.template.description}/>
                                    </Col>
                                    {this.props.shop != 1 ?
                                      <Col md={12} style={{
                                          paddingBottom: '10px'
                                      }}>
                                          <div className="validate"><b>{this.state.data.tags}</b>{' '}characters</div>
                                          <label className="control-label">Tags</label>
                                          <FormControl type="text" placeholder="Use, comas to-separate-tags" onChange={this.handleForms} data-type="tags" onChange={this.handleForms} value={this.state.template.tags}/>
                                      </Col>
                                    : null}
                                    {this.props.shop == 3 ?
                                      <Col md={12} style={{
                                          paddingBottom: '10px'
                                      }}>
                                          <div className="validate"><b>{this.state.data.main_tags}</b>{' '}characters</div>
                                          <label className="control-label">Main tags</label>
                                          <FormControl type="text" placeholder="What one tag would I search to find your design?" data-type="main_tags" onChange={this.handleForms} value={this.state.template.main_tags}/>
                                      </Col>
                                    : null}
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12} className="text-right">
                                <Button bsStyle="primary" onClick={this.create} disabled={this.state.template.name.length == 0}>Create</Button>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}
