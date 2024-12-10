import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar.jsx";
import styles from "./OpenProject.module.css";
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from "axios";

function OpenProject(){

    const [projectData, setProjectData] = useState([]);
    const [taskData, setTaskData] = useState([]);
    const [percentDone, setPercentDone] = useState([]);
    const { project_id } = useParams();
    const navigate = useNavigate();

    function markAsDone() {
        const done_date = new Date();
        // Adjust to Philippine time (UTC +8)
        done_date.setHours(done_date.getHours() + 8);  // Add 8 hours for UTC+8
    
        // Format the date in MySQL-friendly format
        const done_date_str = done_date.toISOString().slice(0, 19).replace('T', ' ');
    
        const due = new Date(projectData[0].due_date);
        const status = done_date < due ? "Done On Time" : "Done Late";
    
        console.log(`ID: ${project_id}`);
        console.log(`Done Date: ${done_date_str}`);
        console.log(`Due Date: ${due}`);
        console.log(`Status: ${status}`);
    
        const confirmation = window.confirm("Are you sure you are done with this project?");
    
        if (confirmation) {
            axios.post('http://localhost:8081/mark-done', { status, done_date: done_date_str, project_id })
                .then((res) => {
                    console.log(res.data);
                    alert("Successfully labeled the project done. Congratulations!");
                })
                .catch((err) => console.log(err));
        }
    }

    function deleteProject(){
        const answer = window.confirm(`Are you sure you want to delete project: "${projectData[0].project_title}"`);
        if(answer){
            removeProject(projectData[0].project_id);
            removeMember(projectData[0].project_id);
            removeAllTask(projectData[0].project_id);
            navigate('/ongoing')
        }
    }

    function removeProject(projectId){
        axios.post('http://localhost:8081/delete-project', { projectId })
        .then((res) => {
            alert("Deleted Successfuly!");
        })
        .catch((err) => {
            console.error("Error deleting: ", err);
        })
    }

    function removeMember(projectId){
        axios.post('http://localhost:8081/delete-members', { projectId })
        .then((res) => {
            console.log("Members Deleted");
        })
        .catch((err) => {
            console.error("Error deleting: ", err);
        })
    }

    function removeAllTask(projectId){
        axios.post('http://localhost:8081/delete-alltask', { projectId })
        .then((res) => {
            console.log("Task Deleted");
        })
        .catch((err) => {
            console.error("Error deleting: ", err);
        })
    }

    function deleteTask(task_id, task_name){

        const answer = window.confirm(`Do you want to delete: ${task_name}`);

        if(answer){
            axios.post('http://localhost:8081/delete-task', { task_id })
            .then((res) => {
                alert("Task deletion successful");
                axios.get('http://localhost:8081/get-task-leader', { params: { project_id } })
            .then((res) => {
                setTaskData(res.data);
            })
            .catch((err) => console.error("Frontend Error: ", err));
                })
                .catch((err) => console.log(err));
        }
    }
    
    useEffect(() => {

        axios.get('http://localhost:8081/project-dash', { params: { project_id } })
        .then((res) => {
            setProjectData(res.data);
            setPercentDone(((res.data[0].done_tasks / res.data[0].total_tasks) * 100).toFixed(2));
        })
        .catch((err) => console.error("Frontend Error: ", err));

        axios.get('http://localhost:8081/get-task-leader', { params: { project_id } })
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

                    <div className={styles.projectInfoHolder} onClick={deleteProject}>
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
                                <p>All Task: {projectData.length > 0 ? projectData[0].total_tasks : 'Fetching...'}</p>
                                <p>Done Task: {projectData.length > 0 ? projectData[0].done_tasks : 'Fetching...'}</p>
                                <p>Pending Task: {projectData.length > 0 ? projectData[0].ongoing_tasks : 'Fetching...'}</p>
                            </div>
                        </div>
                    </div>

                </div>

                <div className={styles.rightSide}>
                    <div className={styles.taskNav}>
                        <h1 className={styles.taskH1}>Tasks</h1>
                        <button onClick={markAsDone} className={styles.markComplete}>Mark Project Complete</button>
                        <Link  className={styles.Link} to={`/addtask/${project_id}`}><button className={styles.addTask}>Add Task</button></Link>
                    </div>
                    <div className={styles.tasksContainer}>

                        {taskData.map((task, index) => {
                            return(
                            <div onClick={() => {deleteTask(task.task_id, task.description)}} className={styles.task} key={task.task_id}>
                                <div className={styles.taskInfo}>
                                    <h1>{taskData.length > 0 ? task.description : 'Fetching...'}</h1>
                                    <p>Assigned to: {taskData.length > 0 ? task.assigned_to : 'Fetching...'}</p>
                                </div>
                                <div className={styles.taskStatDate}>
                                    <p>Status: {taskData.length > 0 ? task.status : 'Fetching...'}</p>
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

export default OpenProject