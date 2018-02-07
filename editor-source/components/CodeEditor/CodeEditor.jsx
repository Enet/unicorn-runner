import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';

import './CodeEditor.styl';

export default class CodeEditor extends Tcaer.Component {
    render () {
        const className = [
            `code-editor`,
            `code-editor_opened_${!!this.props.opened}`
        ];

        return <div className={className}>
            <textarea
                className="code-editor__textarea"
                key={this.state.json}
                onChange={this._onTextareaChange}>
                {this.state.json}
            </textarea>
            <footer className="code-editor__footer">
                <button
                    className="code-editor__button"
                    onClick={this._onSaveButtonClick}>
                    Save
                </button>
                <button
                    className="code-editor__button"
                    onClick={this._onCloseButtonClick}>
                    Close
                </button>
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
