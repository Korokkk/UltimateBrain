import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import SignUp from './SignUp'

//  Reference:
// https://stackoverflow.com/questions/71336895/react-jest-login-form-test

beforeEach(() => {
  render(<BrowserRouter><SignUp /></BrowserRouter>)
})

afterEach(() => {
  cleanup();
});

test('should render signup component', () => {
  const signUpElement = screen.getByTestId('signup');
  expect(signUpElement).toBeInTheDocument();
  expect(signUpElement).toHaveTextContent('Register to Big Brain');
});

test('it should let a user sign up', async () => {
  const register = jest.fn();
  const onSuccess = jest.fn();
  const emailInput = screen.getByTestId('signup-email-input');
  const passwordInput = screen.getByTestId('signup-password-input');
  const nameInput = screen.getByTestId('signup-name-input');
  const registerButton = screen.getByTestId('signup-button');
  userEvent.type(emailInput, 'legend@of.zelda');
  userEvent.type(passwordInput, 'tearsOfKingdom');
  userEvent.type(nameInput, 'link');
  userEvent.click(registerButton);
  await waitFor(() => {
    expect(register).toBeCalledTimes(1)
  })
})
