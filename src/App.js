import React, { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail} from "firebase/auth";
import './App.css';
import initializeAuthentication from "./Firebase/firebase.init";


initializeAuthentication();
const googleProvider = new GoogleAuthProvider();

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLoign] = useState(false);


  const auth = getAuth();

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const user = result.user;
      })
  }

  const toggleLogin = e => {
    setIsLoign(e.target.checked);

  }

  const handleEmailChange = e => {
    setEmail(e.target.value);
  }

  const handlePasswordChange = e => {
    setPassword(e.target.value);
  }

  const handleReg = e => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return;
    }
    if(!/(?=.*[A-Z].*[A-Z])/.test(password)){
      setError('Password must contain 2 upper case');
      return;
    }
    
    // 
    if(isLogin){
      processLogin(email, password);
    }
    else{
      registerNewUser(email, password);
    }

  }

  const processLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
    .then( result => {
      const user = result.user; 
    })
    .catch(err => {
      setError(err.message);
    })
  }

  const registerNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        setError('');
        verifyEmail();
      })
      .catch(error => {
        setError(error.message);
      })
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
    .then (result => {
      console.log(result);
    })
  }


  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
    .then (result => {

    })
  }



  return (
    <div className="mx-5">
      <form onSubmit={handleReg}>
        <h3>Please {isLogin ? 'Login' : 'Register'} </h3>
        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input onBlur={handleEmailChange} type="email" className="form-control" id="inputEmail3" required />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
          <div className="col-sm-10">
            <input onBlur={handlePasswordChange} type="password" className="form-control" id="inputPassword3" required />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-10 offset-sm-2">
            <div className="form-check">
              <input onChange={toggleLogin} className="form-check-input" type="checkbox" id="gridCheck1" />
              <label className="form-check-label" htmlFor="gridCheck1">
                Already Registered?
              </label>
            </div>
          </div>
        </div>
        <div className="row mb-3 text-danger">
          {error}
        </div>
        {/* submit button */}
        <button type="submit" className="btn btn-primary"> {isLogin ? 'Login' : 'Register'} </button>
        <br />
        <button onClick={handleResetPassword}>ResetPW</button>

      </form>
      <br /> <br /> <br />
      <button type="button" onClick={handleGoogleSignIn}>Google SignIn</button>
    </div>
  );
}

export default App;
