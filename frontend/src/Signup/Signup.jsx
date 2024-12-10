import { Link, useNavigate } from "react-router-dom"; 
import { useState } from 'react';
import styles from './Signup.module.css'
import Validation from "./SignupValidation.jsx";
import axios from 'axios';

function Signup(){

    //store the values of inputs from the user
    const [values, setValues] = useState({
      name: '',
      email: '',
      password: ''
    })

    //store errors from patterns and lengths for input here
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    //handle and saves the value of the input everytime it changes
    const handleInput = (event) => {
      setValues(preValues => ({...preValues, [event.target.name]: [event.target.value]}));
    }

    //handle when the form is submitted via button
    const handleSubmit = async (event) => {
      event.preventDefault();
      setErrors(Validation(values));
      if(errors.name ===  "" && errors.email ===  "" && errors.password ===  ""){
        try {
          // Call the /checkexist API to verify if the email already exists
          const checkResponse = await axios.post('http://localhost:8081/checkexist', {
            email: values.email,
          });
    
          if (checkResponse.data === "Failed") {
            alert("Email already exists! Please use a different email.");
          } else if (checkResponse.data === "Success") {
            // If email does not exist, proceed with signup
            const signupResponse = await axios.post('http://localhost:8081/signup', values);
            if (signupResponse.data) {
              alert("Signup successful!");
              navigate('/');
            }
          } else {
            alert("An error occurred while checking email existence. Please try again.");
          }
        } catch (error) {
          console.log("Error during signup process:", error);
        }
      }
    }

    return(
        <>
          <div className={styles.container}>

            <div className={styles.leftDiv}>

              <div className={styles.remarksContainer}>
                <h1>Sign Up</h1>
                <p>Welcome to Yondu ActTrack</p>
              </div>

              <div className={styles.inputContainer}>
                <form action="" onSubmit={handleSubmit} className={styles.forms}>

                  <input type="text" placeholder="Enter Name" 
                  name="name" onChange={handleInput}/>
                  {errors.name && <span className={styles.errors}>{errors.name}</span>}

                  <input type="text" placeholder="Enter Email" 
                  name="email" onChange={handleInput}/>
                  {errors.email && <span className={styles.errors}>{errors.email}</span>}

                  <input type="password" placeholder="Enter Password" 
                  name="password" onChange={handleInput}/>
                  {errors.password && <span className={styles.errors}>{errors.password}</span>}

                  <button type="submit">Create Account</button>
                </form>
              </div>

              <div className={styles.signUpLink}>
                <Link to={"/"}>Already a member? Sign in here!</Link>
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

export default Signup