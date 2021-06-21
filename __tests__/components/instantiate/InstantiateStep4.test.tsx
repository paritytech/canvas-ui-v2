import React from 'react';
import { jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import InstantiateStep4 from '../../../src/components/instantiate/InstantiateStep4';
import { AppState } from '../../../src/types';
import { CanvasContext } from '../../../src/contexts';
import { mockInstantiateState, mockAppState } from '../../../test-utils/mockData';

const mockSubmitHandler = jest.fn();

const customRender = (ui: JSX.Element, providerProps: AppState) => {
  return render(<CanvasContext.Provider value={providerProps}>{ui}</CanvasContext.Provider>);
};
describe('Instantiate Step 4', () => {
  test('displays a button that calls the submit handler', () => {
    customRender(
      <InstantiateStep4
        state={mockInstantiateState}
        dispatch={jest.fn()}
        currentStep={4}
        submitHandler={mockSubmitHandler}
      />,
      { ...mockAppState }
    );
    const submitBtn = screen.getByText('Instantiate');
    expect(submitBtn).toBeInTheDocument();
    fireEvent.click(submitBtn);
    expect(mockSubmitHandler).toHaveBeenCalledTimes(1);
  });
  test('does not render when current step is not 3', () => {
    const { container } = render(
      <InstantiateStep4
        state={mockInstantiateState}
        dispatch={jest.fn()}
        currentStep={1}
        submitHandler={mockSubmitHandler}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
