import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar.jsx";
import styles from "./OpenProjectMember.module.css";
import { useParams, Link } from 'react-router-dom';
import axios from "axios";

function OpenProjectMember(){

    const [projectData, setProjectData] = useState([]);
    const [taskData, setTaskData] = useState([]);
    const [percentDone, setPercentDone] = useState([]);
    const { project_id } = useParams();
    const email = localStorage.getItem("email");

    function completeTask(task_id, due, description, current_status) {
        const date = new Date();
        const dueDate = new Date(due);
        const status = date < dueDate ? "Done On-Time" : "Done Late";

        if(current_status != "Ongoing"){
            alert(`Task "${description}" is already marked as done!`)
            return;
        }

        const answer = window.confirm(`Are you done with task "${description}?"`)

        if(answer){
            axios.post('http://localhost:8081/mark-as-done', { status, task_id })
            .then((res) => {
                console.log(`Message from frontend: No errors`);
                console.log(`Backend Response:`, res.data); // Log backend response
                alert("Successfully Marked as done.");
                reLoadData();
            })
            .catch((err) => {
                console.error("Unexpected error:", err.response || err.message || err); // Log detailed error
                alert("Failed to mark the task as done. Please try again."); // Notify the user of failure
            });
    
            console.log(`Task_id: ${task_id}`);
            console.log(`Due: ${due}`);
            console.log(`Now: ${date}`);
            console.log(`Status: ${status}`);
            }
    }

    function reLoadData(){
        axios.get('http://localhost:8081/project-dash-member', { params: { project_id, email } })
        .then((res) => {
            setProjectData(res.data);
            setPercentDone(((res.data[0].done_tasks / res.data[0].total_tasks) * 100).toFixed(2));
        })
        .catch((err) => console.error("Frontend Error: ", err));

        axios.get('http://localhost:8081/get-task-member', { params: { project_id, email } })
        .then((res) => {
            setTaskData(res.data);
        })
        .catch((err) => console.error("Frontend Error: ", err));
    }
    
    useEffect(() => {
        axios.get('http://localhost:8081/project-dash-member', { params: { project_id, email } })
        .then((res) => {
            setProjectData(res.data);
            setPercentDone(((res.data[0].done_tasks / res.data[0].total_tasks) * 100).toFixed(2));
        })
        .catch((err) => console.error("Frontend Error: ", err));

        axios.get('http://localhost:8081/get-task-member', { params: { project_id, email } })
        .then((res) => {
            setTaskData(res.data);
        })
        .catch((err) => console.error("Frontend Error: ", err));
    }, []);

    return(
        <>
            <Navbar></Navbar>

            <div className={styles.container}>

                <div className={styles.leftSide}>

                    <div className={styles.projectInfoHolder}>
                        <h1 className={styles.projectTitle}>{projectData.length > 0 ? projectData[0].project_title : 'Fetching...'}</h1>
                        <p className={styles.projectdescription}>
                            {projectData.length > 0 ? projectData[0].project_description : 'Fetching...'}
                        </p>
                        <h1 className={styles.projectTitle}>Due Date:</h1>
                        <p className={styles.projectdescription}>
                            {projectData.length > 0 
                            ? new Date(projectData[0].due_date).toLocaleString("en-US", {
                                month: "2-digit",
                                day: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false, // Military time (24-hour format)
                                }) 
                            : 'Fetching...'}
                        </p>
                    </div>

                    <div className={styles.taskInfoHolder}>
                        <h1 className={styles.taskDashH1}>Task Dashboard</h1>
                        <div className={styles.taskDashStats}>
                            <div className={styles.taskBarHolder}>
                                <h1>{projectData.length > 0 ? `${percentDone}%` : 'Fetching...'}</h1>
                            </div>
                            <div className={styles.taskInformation}>
                                <p>Your Task: {projectData.length > 0 ? projectData[0].total_tasks : 'Fetching...'}</p>
                                <p>Your Done Task: {projectData.length > 0 ? projectData[0].done_tasks : 'Fetching...'}</p>
                                <p>Your Pending Task: {projectData.length > 0 ? projectData[0].ongoing_tasks : 'Fetching...'}</p>
                            </div>
                        </div>
                    </div>

                </div>

                <div className={styles.rightSide}>
                    <div className={styles.taskNav}>
                        <h1 className={styles.taskH1}>Tasks</h1>

                    </div>
                    <div className={styles.tasksContainer}>

                        {taskData.map((task, index) => {
                            return(
                            <div className={styles.task} key={task.task_id} onClick={() => {completeTask(task.task_id, task.due_date, task.description, task.status)}}>
                                <div className={styles.taskInfo}>
                                    <h1>{taskData.length > 0 ? task.description : 'Fetching...'}</h1>
                                    <p>Assigned to: {taskData.length > 0 ? task.assigned_to : 'Fetching...'}</p>
                                </div>
                                <div className={styles.taskStatDate}>
                                   
                                    <p>Status: <strong className={styles.status}>{task.status}</strong></p>

                                    <p>Due: {taskData.length > 0 
                                    ? new Date(task.due_date).toLocaleString("en-US", {
                                    month: "2-digit",
                                    day: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false, // Military time (24-hour format)
                                    }) 
                                    : 'Fetching...'}</p>
                                </div>
                            </div>
                            );
                        })}
                        
                    </div>
                </div>

            </div>
        </>
    );
}

export default OpenProjectMember