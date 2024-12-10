

function Validation(values){
    let error = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

    if(values.name === ""){
        error.name = "Name cannot be empty";
    }
    else{
        error.name = "";
    }

    if(values.email === ""){
        error.email = "Email cannot be empty";
    }
    else if(!email_pattern.test(values.email)){
        error.email = "Email pattern not met";
    }
    else{
        error.email = "";
    }

    if(values.password === ""){
        error.password = "Password cannot be empty";
    }
    else if(!password_pattern.test(values.password)){
        error.password = "At least 8 characters contain one capital and a number";
    }
    else{
        error.password = "";
    }
    return error;

}

export default Validation