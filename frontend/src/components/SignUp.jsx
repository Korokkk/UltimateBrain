import React from 'react';
import {
  Link,
  useNavigate,
} from 'react-router-dom';
import Typography from '@mui/material/Typography';

function SignUp ({ onSuccess }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const navigate = useNavigate();
  async function register () {
    const response = await fetch('http://localhost:5005/admin/auth/register', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name,
      })
    });
    const data = await response.json();
    if (!data.error) {
      onSuccess(data.token);
      navigate('/');
    }
  }

  return (
    <div style={{
      width: '60vh',
      backgroundColor: '#90caf9',
      margin: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}
    data-testid='signup'
    >
      <Typography id='signupFormLabel' variant="h4"> Register to Big Brain </Typography>
      <form>
        <label htmlFor='signup-email'>Email</label>
        <input
          id='signup-email'
          data-testid='signup-email-input'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          aria-required='true'
          required
        /> <br />
        <label htmlFor='signup-password'>Password</label>
        <input
          id='signup-password'
          data-testid='signup-password-input'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          aria-required='true'
          required
        /> <br />
        <label htmlFor='signup-name'>Name</label>
        <input
          id='signup-name'
          data-testid='signup-name-input'
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-required='true'
          type="text"
        /> <br />
        <button
          data-testid='signup-button'
          onClick={register}>Register</button>
      </form>
      <p>Already have a BigBrain? <span><Link to="/signin">Log in</Link></span></p>
    </div>
  );
}

export default SignUp;
