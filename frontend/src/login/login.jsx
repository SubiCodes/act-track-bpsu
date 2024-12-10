import { Link, useNavigate } from "react-router-dom";
import styles from './Login.module.css'
import { useState, useEffect } from "react";
import Validation from "./LoginValidation.jsx";
import axios from 'axios';

function Login(){

  //store the values of inputs from the user
  const [values, setValues] = useState({
    email: '',
    password: ''
  })

  //store errors from patterns and lengths for input here
  const [errors, setErrors] = useState({});

  useEffect(() => {
    localStorage.setItem("loggedIn", "false");
    localStorage.removeItem("email");
  }, [])

  //handle and saves the value of the input everytime it changes
  const handleInput = (event) => {
    setValues(preValues => ({...preValues, [event.target.name]: [event.target.value]}));
  }

  const navigate = useNavigate();

  //handle when the form is submitted via button
  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(Validation(values));
    if(errors.email ===  "" && errors.password ===  ""){
      axios.post('http://localhost:8081/login', values)
      .then(res => {
        if(res.data === "Success"){
          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("email", values.email);
          navigate("/ongoing");
        }else{
          alert("Incorrect username or password!");
        }
      })
      .catch(error => console.log(error))
    }
  }

return (
  <>

    <div className={styles.container}>

      <div className={styles.leftDiv}>

        <div className={styles.remarksContainer}>
          <h1>Sign In</h1>
          <p>Welcome to Yondu ActTrack</p>
        </div>

        <div className={styles.inputContainer}>
          <form action="" onSubmit={handleSubmit} className={styles.forms}>
            <input type="text" placeholder="Enter Email" className={styles.inputs1}
            name="email" onChange={handleInput}/>
            {errors.email && <span className={styles.errors}>{errors.email}</span>}

            <input type="password" placeholder="Enter Password" className={styles.inputs2} 
            name="password"  onChange={handleInput}/>
            {errors.password && <span className={styles.errors}>{errors.password}</span>}

            <button type="submit" >Login</button>
          </form>
        </div>

        <div className={styles.signUpLink}>
          <Link to={"/signup"}>Not yet a member? Sign up here!</Link>
        </div>

      </div>

      <div className={styles.rightDiv}>
        <div className={styles.yonduIllustration}>
          <img src="/src/assets/bpsu-logo.png" alt="Illustration" />
        </div>
      </div>

    </div>
  
  </>  
  );
}

export default Login