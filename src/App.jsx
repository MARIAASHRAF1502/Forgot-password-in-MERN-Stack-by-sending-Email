import { BrowserRouter as Router, Routes,Route,Link} from "react-router-dom";
import './App.css'
import Login from './login';
import ForgetPage from './Forget';
import Register from './register';


function App() {


  return (
    <>
    <div className="header">
    <Router> 
      <Routes>
        <Route path="/" element={<Login/>}></Route>
        <Route path="/forgetpwd" element={<ForgetPage/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
      </Routes>
    </Router>
    </div>
    </>
  )
}

export default App;
