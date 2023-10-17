import React from 'react';
import { render, screen, cleanup } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import SignIn from './SignIn'

//  i read this ↓
// https://stackoverflow.com/questions/71336895/react-jest-login-form-test

afterEach(() => {
  cleanup();
});

test('should render signin component', () => {
  render(<BrowserRouter><SignIn /></BrowserRouter>)
  const signInElement = screen.getByTestId('signin');
  expect(signInElement).toBeInTheDocument();
  expect(signInElement).toHaveTextContent('Welcome to Big Brain');
});
