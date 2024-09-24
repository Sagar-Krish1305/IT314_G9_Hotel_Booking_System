import logo from './logo.svg';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Signup} from "./components/Signup";
import { Login } from './components/Login';

function App() {

    return (
      <div>
        <Signup/>
        {/* <Login/> */}
        <ToastContainer />
      </div>
    );
}

export default App;
