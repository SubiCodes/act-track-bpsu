

function ChangeNameValidation(values){
    let error = "";

    if(values.trim() === ""){
        error = "Name cannot be empty";
    }

    return error;
}

export default ChangeNameValidation