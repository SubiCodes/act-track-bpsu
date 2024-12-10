import styles from './Completed.module.css';
import addIcon from '../assets/add-icon.png';
import Navbar from '../Navbar/Navbar';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function Completed(){

     //used for accessing variables sent from another page
     const location = useLocation();
     //access the variable from another page
     const email = localStorage.getItem("email");
     
     //store project id's retrieve
     const [projectInfo, setProjectInfo] = useState([]);
     //store project informations
     const [projects, setProjects] = useState({});
     
     //get the project_id where the email is a member of
     useEffect(() => {
         console.log(email);
         axios.get('http://localhost:8081/projects', { params: {email} })
         .then((res) =>  {
             setProjects(p => res.data); 
         })
         .catch((error) => console.log(error));
     }, [location]);
 
     //when the projects value changes get the data related to the project_id retrieve
     useEffect(() => {
         if (projects && projects.length > 0) {
             axios.get('http://localhost:8081/project-done', {
                 params: { projects: projects.map(p => p.project_id) } // Send an array of project_ids
             })
             .then((res) => {
                 console.log(res);
                 setProjectInfo(res.data);
             })
             .catch((error) => console.log(error));
         }
     }, [projects]);


    return(

        <>
        <div className={styles.container}>
                
                <Navbar></Navbar>

                <div className={styles.completedCreateContainer}>
                    <h1>Completed Projects</h1>
                </div>

                <div className={styles.projects}>
                     
                {projectInfo.map((project, index) => {

                    let statusColor = '#FFFFFF';

                    if(project.status === 'On Time'){
                        statusColor = '#77DD77'
                    }
                    else if(project.status === 'Done Late'){
                        statusColor = '#FF6961'
                    }



                        return (
                            <div className={styles.projectContainer} key={project.project_id}>
                                <div className={styles.titleDescription}>
                                    <h1>{project.project_title}</h1>
                                    <p>{project.project_description}</p>
                                </div>
                                <div className={styles.owner}>
                                    <h1>Leader:</h1>
                                    <p>{project.created_by}</p>
                                </div>
                                <div className={styles.due}>
                                    <h1>Due:</h1>
                                    <p>{new Date(project.due_date).toLocaleString("en-US", { month: "2-digit", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}</p>
                                </div>
                                <div className={styles.dateAccom}>
                                    <h1>Date Done:</h1>
                                    <p>{new Date(project.completed_at).toLocaleString("en-US", { month: "2-digit", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}</p>
                                </div>
                                <div className={styles.status}>
                                    <div className={styles.statusTag}>
                                        <h1>Status:</h1>
                                    </div>
                                    <div className={styles.statusBox} style={{backgroundColor: statusColor}}>
                                        <p>{project.status}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    
                </div>

         </div>
        </>

    );
}

export default Completed