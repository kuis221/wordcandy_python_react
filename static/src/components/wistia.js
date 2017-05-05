import React, {Component} from 'react';


export default class Wistia extends Component {

    constructor(props) {
        super(props);
        this.state = {
            videoSrc: "//fast.wistia.net/embed/iframe/" + this.props.video + "?videoFoam=true"
        };
    }

    render() {
        return (
            <div>
                <script src="//fast.wistia.net/assets/external/iframe-api-v1.js"></script>
                <iframe width={this.props.width} height={this.props.height} src={this.state.videoSrc} allowtransparency="true" frameborder="0" scrolling="no" className="wistia_embed" name="wistia_embed" allowfullscreen mozallowfullscreen webkitallowfullscreen oallowfullscreen msallowfullscreen></iframe>
            </div>
        );
    }
}
