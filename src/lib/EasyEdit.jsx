import React from 'react';
import PropTypes from 'prop-types';
import './EasyEdit.css';

// local modules
import Globals from './globals';
import EasyDropdown from './EasyDropdown.jsx';
import EasyInput from "./EasyInput.jsx";
import EasyParagraph from "./EasyParagraph.jsx";
import EasyRadio from "./EasyRadio.jsx";
import EasyCheckbox from "./EasyCheckbox.jsx";
import EasyColor from "./EasyColor.jsx";

export default class EasyEdit extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      hover: false,
      value: props.value,
      tempValue: props.value
    };

    this.saveButton = React.createRef();
    this.cancelButton = React.createRef();

    this.onClick = this.onClick.bind(this);
    this.hoverOn = this.hoverOn.bind(this);
    this.hoverOff = this.hoverOff.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  _onSave = () => {
    const {onSave} = this.props;
    const tempValue = this.state.tempValue;
    this.setState({editing: false, value: tempValue},
        () => onSave(this.state.value));
  };

  _onCancel = () => {
    const {onCancel} = this.props;
    const value = this.state.value;
    this.setState({editing: false, tempValue: value}, () => onCancel());
  };

  onChange = e => {
    this.setState({tempValue: e.target.value});
  };

  onCheckboxChange = e => {
    let values = this.state.tempValue || [];
    if (e.target.checked) {
      if (!values.includes(e.target.value)) {
        values.push(e.target.value);
      }
    } else {
      values.splice(values.indexOf(e.target.value), 1);
    }
    this.setState({tempValue: values});
  };

  onClick() {
    const {allowEdit} = this.props;
    if (allowEdit) {
      this.setState({editing: true});
    }
  }

  hoverOn() {
    const {allowEdit} = this.props;
    if (allowEdit) {
      this.setState({hover: true});
    }
  }

  hoverOff() {
    this.setState({hover: false});
  }

  renderInput() {
    const {name, type, options, placeholder, min, max, disabled} = this.props;
    const editing = this.state.editing;
    switch (type) {
      case 'text':
      case 'number':
      case 'date':
      case 'datetime-local':
      case 'time':
      case 'month':
      case 'week':
        return (
            <EasyInput
                value={editing ? this.state.tempValue : this.state.value}
                placeholder={placeholder}
                onChange={this.onChange}
                type={type}
                name={name}
                min={min}
                max={max}
                disabled={disabled}
            />
        );
      case 'color':
        return (
            <EasyColor
                value={editing ? this.state.tempValue : this.state.value}
                onChange={this.onChange}
                name={name}
                disabled={disabled}
            />
        );
      case 'textarea':
        return (
            <EasyParagraph
                value={editing ? this.state.tempValue : this.state.value}
                placeholder={placeholder}
                onChange={this.onChange}
                name={name}
                disabled={disabled}
            />);
      case 'select':
        return (
            <EasyDropdown
                value={editing ? this.state.tempValue : this.state.value}
                onChange={this.onChange}
                options={options}
                name={name}
                placeholder={placeholder === Globals.DEFAULT_PLACEHOLDER
                    ? Globals.DEFAULT_SELECT_PLACEHOLDER : placeholder}
                disabled={disabled}
            />
        );
      case 'radio':
        return (
            <EasyRadio
                value={editing ? this.state.tempValue : this.state.value}
                onChange={this.onChange}
                options={options}
                disabled={disabled}
            />
        );
      case 'checkbox':
        return (
            <EasyCheckbox
                value={editing ? this.state.tempValue : this.state.value}
                onChange={this.onCheckboxChange}
                options={options}
                disabled={disabled}
            />
        );
      default: {
        throw new Error(Globals.ERROR_UNSUPPORTED_TYPE);
      }
    }

  }

  renderButtons() {
    const {saveButtonLabel, saveButtonStyle, cancelButtonLabel, cancelButtonStyle} = this.props;
    return (
        <div className="easy-edit-button-wrapper">
          {EasyEdit.generateButton(this.saveButton, this._onSave,
              saveButtonLabel, saveButtonStyle, "save")}
          {EasyEdit.generateButton(this.cancelButton, this._onCancel,
              cancelButtonLabel, cancelButtonStyle, "cancel")}
        </div>
    )
  }

  setCssClasses(existingClasses) {
    return this.state.hover ?
        'easy-edit-hover-on ' + existingClasses :
        existingClasses;
  }

  static generateButton(ref, onClick, label, cssClass, name) {
    return (
        <button ref={ref} onClick={onClick} className={cssClass} name={name}>
          {label}
        </button>
    )
  }

  renderPlaceholder() {
    const {type, placeholder, options} = this.props;
    switch (type) {
      case 'text':
      case 'email':
      case 'textarea':
      case 'number':
      case 'date':
      case 'datetime-local':
      case 'time':
      case 'month':
      case 'week': {
        return (
            <div
                className={this.setCssClasses('easy-edit-wrapper')}
                onClick={this.onClick}
                onMouseEnter={this.hoverOn}
                onMouseLeave={this.hoverOff}
            >
              {this.state.value ? this.state.value : placeholder}
            </div>
        );
      }
      case 'radio':
      case 'select': {
        let selected;
        if (this.state.value) {
          selected = options.filter((option) => {
            return this.state.value.includes(option.value);
          });
        }
        return (
            <div
                className={this.setCssClasses('easy-edit-wrapper')}
                onClick={this.onClick}
                onMouseEnter={this.hoverOn}
                onMouseLeave={this.hoverOff}
            >
              {this.state.value ? selected[0].label : placeholder}
            </div>
        );
      }
      case 'color':
        return (
            <input
                type={type}
                value={this.state.value}
                onClick={this.onClick}
                readOnly
            />
        );
      case 'checkbox': {
        let selected;
        if (this.state.value) {
          selected = options.filter((option) => {
            return this.state.value.includes(option.value);
          });
        }
        return (
            <div
                className={this.setCssClasses('easy-edit-wrapper')}
                onClick={this.onClick}
                onMouseEnter={this.hoverOn}
                onMouseLeave={this.hoverOff}
            >
              {this.state.value && this.state.value.length !== 0 ? selected.map(
                  checkbox => checkbox.label).join(', ') : placeholder}
            </div>);
      }
      default: {
        throw new Error(Globals.ERROR_UNSUPPORTED_TYPE);
      }
    }

  }

  render() {
    if (this.state.editing) {
      return (
          <div className="easy-edit-inline-wrapper">
            {this.renderInput()}
            {this.renderButtons()}
          </div>)
    } else {
      return this.renderPlaceholder()
    }
  }
}

EasyEdit.propTypes = {
  type: PropTypes.oneOf([
    'text', 'number', 'color', 'textarea', 'date', 'datetime-local',
    'time', 'month', 'week', 'radio', 'checkbox', 'select'
  ]).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array
  ]),
  options: PropTypes.array,
  saveButtonLabel: PropTypes.string,
  saveButtonStyle: PropTypes.string,
  cancelButtonLabel: PropTypes.string,
  cancelButtonStyle: PropTypes.string,
  placeholder: PropTypes.string,
  onCancel: PropTypes.func,
  onSave: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  min: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  max: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  disabled: PropTypes.bool,
  allowEdit: PropTypes.bool
};

EasyEdit.defaultProps = {
  value: null,
  saveButtonLabel: Globals.DEFAULT_SAVE_BUTTON_LABEL,
  saveButtonStyle: 'easy-edit-button',
  cancelButtonLabel: Globals.DEFAULT_CANCEL_BUTTON_LABEL,
  cancelButtonStyle: 'easy-edit-button',
  placeholder: Globals.DEFAULT_PLACEHOLDER,
  disabled: false,
  allowEdit: true,
  onCancel: () => {
  }
};
