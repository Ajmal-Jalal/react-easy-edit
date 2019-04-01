import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import EasyRadio from "./EasyRadio";

configure({adapter: new Adapter()});

describe('EasyRadio', () => {
  let wrapper;
  const onChange = jest.fn();
  const options = [{label: 'Test One', value: 1},
    {label: 'Test Two', value: 2}];

  beforeEach(() => {
    wrapper = shallow(
        <EasyRadio
            options={options}
            onChange={onChange}
            value={1}
            instructions="My instructions"
        />
    );
  });

  it('should render two radio buttons', () => {
    expect(wrapper.find('input')).toHaveLength(2);
  });

  it('should set the instructions provided as a prop', () => {
    expect(wrapper.find('.easy-edit-instructions')).toHaveLength(1);
    expect(wrapper.find('.easy-edit-instructions').text()).toEqual("My instructions");
  });

});
