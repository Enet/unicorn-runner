import Tcaer from 'tcaer';

import './Information.styl';

export default class Information extends Tcaer.Component {
    render () {
        const className = [
            `information`
        ];
        return <div
            className={className}
            dangerouslySetInnerHtml={this.children} />
    }
}
