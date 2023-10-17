import React from 'react';
import {
  Link,
  useNavigate,
} from 'react-router-dom';
import {
  Box,
} from '@mui/material';
import Typography from '@mui/material/Typography';

const IDS = {
  emailInput: 'email',
  emailError: 'login-email-error',
  passwordInput: 'password',
  passwordError: 'login-password-error',
}

function SignIn ({ onSuccess, errors = {} }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  async function login () {
    const response = await fetch('http://localhost:5005/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      })
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      onSuccess(data.token);
      navigate('/dashboard');
    }
  }

  return (
    <div
      style={{
        width: '60vh',
        backgroundColor: '#90caf9',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
      data-testid='signin'
    >
      <Typography variant="h4"> Welcome to Big Brain </Typography>
      <Box>
        <form>
          <Box sx={{ width: '20%', display: 'flex', justifyContent: 'space-between' }}>
            <label htmlFor={IDS.emailInput}>Email: </label>
            <input
              id={IDS.emailInput}
              name='email'
              type='email'
              required
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? IDS.emailError : undefined}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            /> <br />
            {errors.email
              ? (
              <p id={IDS.emailError} aria-live='polite'>
                {errors.email}
              </p>
                )
              : null}
          </Box>
          <label htmlFor={IDS.passwordInput}>Password: </label>
          <input
            id={IDS.passwordInput}
            name='password'
            type='password'
            required
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? IDS.passwordError : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /> <br />

          <button
            name='login'
            onClick={login}>Log in</button>
        </form>
      </Box>
      <p>New to BigBrain? <span><Link to="/signup">Register</Link></span></p>
    </div>
  );
}

export default SignIn;
