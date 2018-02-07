import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';

import './Editor.styl';

export default class Editor extends Tcaer.Component {
    render () {
        const className = [
            `editor`,
            `editor_opened_${!!this.props.opened}`
        ];

        return <div className={className}>
            <textarea
                className="editor__textarea"
                key={this.state.json}
                onChange={this._onTextareaChange}>
                {this.state.json}
            </textarea>
            <footer className="editor__footer">
                <button onClick={this._onSaveButtonClick}>Save</button>
                <button onClick={this._onCloseButtonClick}>Close</button>
            </footer>
        </div>
    }

    componentWillMount () {
        this.componentWillUpdate(this.props);
    }

    componentWillUpdate (nextProps) {
        if (this.props.opened) {
            return;
        }
        this.state.json = nextProps.json;
    }

    @autobind
    _onSaveButtonClick () {
        this.props.onSave && this.props.onSave(this.state.json);
    }

    @autobind
    _onCloseButtonClick () {
        this.props.onClose && this.props.onClose();
    }

    @autobind
    _onTextareaChange (event) {
        const json = event.currentTarget.value;
        this.setState({json});
    }
}
