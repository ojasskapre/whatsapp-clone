import '../css/Login.css';
import Button from '@mui/material/Button';
import { useAuth } from './auth/AuthContext';

const Login = () => {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="login">
      <div className="login__container">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/150px-WhatsApp.svg.png"
          alt=""
        />
        <div className="login__text">
          <h1>Sign in to WhatsApp</h1>
        </div>
        <Button onClick={signInWithGoogle}>Sign in with Google</Button>
      </div>
    </div>
  );
};

export default Login;
