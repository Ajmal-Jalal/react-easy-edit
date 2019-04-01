import React from 'react';
import PropTypes from 'prop-types';
import './EasyEdit.css';

const EasyCheckbox = (props) => {
  let {options, value, onChange, attributes, instructions} = props;
  value = value || [];
  let checkboxes = options.map(option => (
          <label key={option.value} className="easy-edit-checkbox-label">
            <input
                {...attributes}
                type="checkbox"
                className="easy-edit-radio-button"
                value={option.value}
                key={option.value}
                onChange={onChange}
                checked={value.includes(option.value)}
            />{option.label}
          </label>
      )
  );
  return (
      <div>
        {checkboxes}
        <div className="easy-edit-instructions">{instructions}</div>
      </div>
  );
};

EasyCheckbox.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.array.isRequired,
  value: PropTypes.array,
  attributes: PropTypes.object,
  instructions: PropTypes.string
};

EasyCheckbox.defaultProps = {
  attributes: {},
  instructions: null
};

export default EasyCheckbox;
