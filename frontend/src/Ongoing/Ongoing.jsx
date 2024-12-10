import styles from './Ongoing.module.css';
import addIcon from '../assets/add-icon.png';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar.jsx';

function Ongoing(){

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
        axios.get('http://localhost:8081/projects', { params: {email} })
        .then((res) =>  {
            setProjects(p => res.data); 
        })
        .catch((error) => console.log(error));
    }, [location]);

    //when the projects value changes get the data related to the project_id retrieve
    useEffect(() => {
        if (projects && projects.length > 0) {
            axios.get('http://localhost:8081/project', {
                params: { projects: projects.map(p => p.project_id) } // Send an array of project_ids
            })
            .then((res) => {
                setProjectInfo(res.data);
            })
            .catch((error) => console.log(error));
        }
    }, [projects]);
    
    //testing purposes
    function loadProjects(){
        console.log(email);
        console.log(projects);
        console.log(projectInfo);
    }

    return(
        <>
            <div className={styles.container}>
                
                <Navbar></Navbar>

                <div className={styles.ongoingCreateContainer}>
                    <h1>Projects</h1>
                    <Link className={styles.Link} to={"/addproject"}>
                        <div className={styles.addProj}>
                            <img src={addIcon} alt="" />
                            <h1>Add a Project</h1>
                        </div>
                    </Link>
                </div>

                <div className={styles.projects}>
                    {projectInfo.map((project, index) => {
                        // Calculate the progress percentage
                        const totalCount = project.done_count + project.not_done_count;
                        const percentage = totalCount === 0 ? 0 : (project.done_count / totalCount) * 100;

                        const destination = email === project.created_by ? '/openproject' : '/openprojectmember';

                        return (
                            <Link to={`${destination}/${project.project_id}`} className={styles.projectLink}>
                                
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
                                    <div className={styles.progress}>
                                        <h1>Progress:</h1>
                                        <div className={styles.progressBarContainer}>
                                            <div
                                                className={styles.progressBar}
                                                style={{ width: `${percentage}%` }} // Set width dynamically
                                            ></div>
                                        </div>
                                        <p>{`${project.done_count} / ${project.not_done_count + project.done_count}`}</p>
                                    </div>
                                </div>

                            </Link>
                            
                        );
                    })}


                    


                </div>

            </div>
        </>
    );
}

export default Ongoing