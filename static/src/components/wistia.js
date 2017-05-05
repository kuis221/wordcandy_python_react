import React, {Component} from 'react';


export default class Wistia extends Component {

    constructor(props) {
        super(props);
        this.state = {
            videoSrc: "//fast.wistia.net/embed/iframe/" + this.props.video
        };
    }

    render() {
        return (
            <div>
                <script src="//fast.wistia.net/assets/external/iframe-api-v1.js"></script>
                <iframe width={this.props.width} height={this.props.height} src={this.state.videoSrc} frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
            </div>
        );
    }
}
