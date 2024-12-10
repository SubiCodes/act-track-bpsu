import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar.jsx";
import styles from "./AddTask.module.css";
import { useParams } from "react-router-dom";

function AddTask(){

    const { project_id } = useParams();
    const email = localStorage.getItem("email"); 
    const [description, setDescription] = useState("");
    const [assignment, setAssignment] = useState("");
    const [due, setDue] = useState("");
    const [projectMembers, setProjectMembers] = useState([]);

    //onChange handlers
    function handleDescriptionChange(event){
        setDescription(event.target.value);
    }
    function handleAssignmentChange(event){
        setAssignment(event.target.value);
    }
    function handleDueChange(event){
        setDue(event.target.value);
    }

    
    //check if the same task already exist
    function getTasks() {

        if(description.trim() === "" || assignment.trim() === "" || due.trim() === ""){
            alert("A field cannot be set to empty!");
            return;
        }

        const taskValues = [
            project_id,
            description,
            assignment,
            due,
        ];
    
        const query = taskValues.map((value, index) => `param${index}=${encodeURIComponent(value)}`).join('&');
        axios.get(`http://localhost:8081/gettaskid?${query}`)
        .then((res) => {
            if(res.data.length < 1){
                console.log("Successful Search");
                addTask();
                setDescription("");
                setAssignment("");
                setDue("");
            }
            else{
                alert("An exact copy of this task already exist.")
            }
        })
        .catch((error) =>  console.log(error)); 
    }

    //add task
    function addTask(){
        axios.post('http://localhost:8081/add-task', { project_id, description, assignment, due })
        .then((res) => {
            alert("Successfully Added the task.");
        })
        .catch((error) => {
            console.error(`Error adding ${email}:`, error.response ? error.response.data.message : error.message);
        });
    }

    //get all members make the assign to dropdown
    useEffect(() => {
        axios.get('http://localhost:8081/get-members', { params: { project_id, email } })
        .then((res) => {
            console.log(`Email: ${email}, ProjectID: ${project_id}, Data: ${res.data}`);
            setProjectMembers(res.data);
        })
        .catch((err) => console.error("Frontend Error: ", err));
    }, []);

    //Make the date picker allow only future dates.
    useEffect(() => {
        const currentDate = new Date();

        const futureDate = new Date(currentDate);
        futureDate.setDate(currentDate.getDate() + 1);

        const formattedFutureDate = futureDate.toISOString().slice(0, 16);
        const dateTimeInput = document.getElementById('datetime');
        if (dateTimeInput) {
            dateTimeInput.setAttribute('min', formattedFutureDate);
        }
    }, []);


    return(
        <>
            <Navbar></Navbar>

            <div className={styles.mainContainer}>

                <div className={styles.formBox}>

                    <div className={styles.Remarks}>
                        <h1>Add Task</h1>
                    </div>

                    <div className={styles.taskDescription}>
                        <label>Title:</label>
                        <input type="text" placeholder="ex. Create an API that gets members." value={description} onChange={handleDescriptionChange}/>
                    </div>

                    <div className={styles.taskAssignment}>
                        <label>Assign:</label>
                        <select value={assignment} onChange={handleAssignmentChange}>
                            <option value="" disabled>
                                Select a member
                            </option>
                            {projectMembers.map((member, index) => (
                                <option value={member.user_email} key={index}>
                                    {member.user_email}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.taskDuedate}>
                        <label>Due:</label>
                        <input type="datetime-local" id="datetime" placeholder="ex. 01/01/2100 00:00AM" value={due} onChange={handleDueChange}/>
                    </div>

                    <div className={styles.taskButtons}>
                        <button className={styles.buttonCancel}>Cancel</button>
                        <button className={styles.buttonSubmit} onClick={getTasks}>Submit</button>
                    </div>

                </div>

            </div>
        </>
    );
}

export default AddTask