import { Link } from 'react-router-dom'
import Navbar from '../Navbar/Navbar.jsx';
import styles from './EditAccount.module.css';
import ChangePasswordValidation from './ChangePasswordValidation.jsx';
import { useEffect, useState } from 'react';
import axios from 'axios';

function EditAccount(){

    const [currentName, setCurrentName] = useState("");
    const [newName, setNewName] = useState("");
    const [changeNameError, setChangeNameError] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [currentPasswordInput, setCurrentPasswordInput] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [currentPasswordError, setCurrentPasswordError] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [rePasswordError, setRePasswordError] = useState("");

    const email = localStorage.getItem("email");

    //store the input in a variable
    function handleNewNameChange(event){
        setNewName(event.target.value);
    }

    function handleCurrentPasswordInput(event){
        setCurrentPasswordInput(event.target.value);
    }

    function handleNewPasswordInput(event){
        setNewPassword(event.target.value);
    }

    function handleRePasswordInput(event){
        setRePassword(event.target.value);
    }

    //clear name inputs
    function handleClearName(){
        const input = document.getElementById("newName");
        input.value = "";  

        setChangeNameError("");
    }

    //clear password inputs
    function handleClearPasswordInputs(){
        const currentPass = document.getElementById("currentPass");
        const newPass = document.getElementById("newPass");
        const reEnter = document.getElementById("reEnter");

        currentPass.value = "";
        newPass.value = "";
        reEnter.value = "";

        setCurrentPasswordError("");
        setNewPasswordError("");
        setRePasswordError("");
    }

    //on click of change name update the database
    function handleChangeName() {
        let error = "";

        if (newName.trim() === ""){
            error = "Name cannot be empty!"
        }
        else{
            error = "";
        }

        if (error !== "") {
            setChangeNameError(error); 
        } else {
            changeUsername(); 
        }
    }


    //on click of change password update on the database
    function handleChangePassword(){
        let errorCurrent = "";
        let errorMatch = "";
        if(currentPassword !== currentPasswordInput){
            errorCurrent = "Did not match current password.";
            console.log(currentPassword);
            console.log(currentPasswordInput);
        }else{
            errorCurrent = "";
        }

        let errorNewInput = ChangePasswordValidation(newPassword);

        if(newPassword !== rePassword){
            errorMatch = "Password mismatch"
        }else{
            errorMatch = "";
        }

        if(errorCurrent === "" && errorMatch === "" && errorNewInput ===""){
            changePassword();
            getPass(email);
            handleClearPasswordInputs();    
        }
        else{
            setCurrentPasswordError(errorCurrent);
            setNewPasswordError(errorNewInput);
            setRePasswordError(errorMatch);
        }

    }

    //recallable function to get the username
    function getName(user){
        axios.get('http://localhost:8081/get-username', { params: {email: user} })
        .then((res) => {
            setCurrentName(res.data);
        })
        .catch((err) => console.log(err));
    }

    //recallable function to get user password
    function getPass(user){
        axios.get('http://localhost:8081/get-password', { params: {email: user} })
        .then((res) => {
            setCurrentPassword(res.data);
        })
        .catch((err) => console.log(err));
    }

    //recallabel function for changing password
    function changePassword(){
        axios.post('http://localhost:8081/change-password', { password: newPassword, email })
                .then((res) => {
                    alert("Successful Change of Password.");
                    setCurrentPasswordInput("");
                    setNewPassword("");
                    setRePassword("");
                })
                .catch((err) => console.log(err));
    }

    //recallable function to change username
    function changeUsername(){
        axios.post('http://localhost:8081/change-username', { name: newName, email })
                .then((res) => {
                    const input = document.getElementById("newName");
                    input.value = "";  
                    setNewName("");
                    alert("Successful Change of Username.")
                    getName(email);
                    setChangeNameError("");
                })
                .catch((err) => console.log(err));
    }

    //get username on mount
    useEffect(() => {
        getName(email);
    }, [])

    //get user password on mount
    useEffect(() => {
        getPass(email);
    }, [])

    function deBug(){
        console.log(email);
        console.log(newName);
        console.log(currentName);
        console.log(currentPassword);
    }

    

    return(
        <>
            <Navbar></Navbar>

            <div className={styles.mainContainer}>

                <div className={styles.changenameDiv}>

                    <div className={styles.remarksChangeName}>
                        <h1>Edit Username</h1>
                    </div>

                    <div className={styles.currentNameHolder}>
                        <label htmlFor="currentName">Username:</label>
                        <input type="text" name="currentName" id="currentName" value={currentName} readOnly/>
                    </div>

                    <div className={styles.currentNameHolder}>
                        <label htmlFor="newName">New Username:</label>
                        <input type="text" name="newName" id="newName" placeholder='Enter a new name' onChange={handleNewNameChange}/>
                    </div>
                    {changeNameError && <span className={styles.errors}>{changeNameError}</span>}

                    <div className={styles.buttonHolder}>
                        <button  onClick={handleClearName} className={styles.clearButton}>Clear</button>
                        <button onClick={handleChangeName} className={styles.changeButton}>Change Name</button>
                    </div>
                    
                </div>

                <div className={styles.changepassDiv}>

                    <div className={styles.remarksChangePass}>
                        <h1>Change Password</h1>
                    </div>

                    <div className={styles.passDiv}>
                        <label htmlFor="currentPass" id={styles.currentPassLabel}>Password:</label>
                        <input type="password" name="currentPass" id="currentPass" placeholder='Enter your current password' onChange={handleCurrentPasswordInput}/>
                        {currentPasswordError && <span className={styles.errors}>{currentPasswordError}</span>}
                    </div>

                    <div className={styles.passDiv}>
                        <label htmlFor="newPass" id={styles.currentPassLabel}>New Password:</label>
                        <input type="password" name="newPass" id="newPass" placeholder='Enter a new password' onChange={handleNewPasswordInput}/>
                        {newPasswordError && <span className={styles.errors}>{newPasswordError}</span>}
                        <input type="password" name="reEnter" id="reEnter" placeholder='Re-enter Password' onChange={handleRePasswordInput}/>
                        {rePasswordError && <span className={styles.errors}>{rePasswordError}</span>}
                    </div>
                    

                    <div className={styles.buttonHolder}>
                        <button  onClick={handleClearPasswordInputs} className={styles.clearButton}>Clear</button>
                        <button onClick={handleChangePassword} className={styles.changeButton}>Change Password</button>
                    </div>

                </div>

            </div>

        </>
    );
}

export default EditAccount