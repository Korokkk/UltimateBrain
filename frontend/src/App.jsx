import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  // Navigate,
} from 'react-router-dom';
// my components
import Home from './components/Home';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';
import EditGamePage from './components/EditGamePage.jsx';
import QuestionEditPage from './components/QuestionEditPage';
import AdminResultPage from './components/AdminResultPage';
import PlayerJoinPage from './components/PlayerJoinPage';
import PlayerPlayingPage from './components/PlayerPlayingPage';

function App () {
  const [token, setToken] = React.useState(null);

  function manageTokenSet (token) {
    setToken(token);
    localStorage.setItem('token', token);
  }

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  // const ProtectedRoute = ({ children }) => {
  //   if (!token) {
  //     return <Navigate to="/signin" />;
  //   }
  //   return children;
  // };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<SignUp onSuccess={manageTokenSet}/>} />
          <Route path='/signin' element={<SignIn onSuccess={manageTokenSet}/>} />
          <Route path='/dashboard' element={<Dashboard token={token}/>} />
          <Route path='/editgame' element={<EditGamePage />} />
          <Route path='/editgame/:quizid' element={<EditGamePage />} />
          <Route path='/editgame/:quizid/:questionid' element={<QuestionEditPage />} />
          <Route path='/adminresult' element={<AdminResultPage />} />
          <Route path='/adminresult/:sessionid' element={<AdminResultPage />} />
          <Route path='/playquiz/' element={<PlayerJoinPage />} />
          <Route path='/playquiz/:sessionid' element={<PlayerJoinPage />} />
          <Route path='/playquiz/:sessionid/:playerid' element={<PlayerPlayingPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
