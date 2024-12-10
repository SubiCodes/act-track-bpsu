function ChangePasswordValidation(value){
    let error = "";
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;


    if(value.trim() === ""){
        error = "Password cannot be empty";
    }
    else if(!password_pattern.test(value)){
        error = "8 characters, one capital,  number";
    }
    else{
        error = "";
    }
    return error;

}

export default ChangePasswordValidation