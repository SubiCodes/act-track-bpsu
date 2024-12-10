import { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import styles from './AddProject.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddProject(){

    const [minDate, setMinDate] = useState("");
    const [projectTitle, setProjectTitle] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [projectDueDate, setProjectDueDate] = useState("");
    const [projectTechStack, setProjectTechStack] = useState("");
    const [projectTechStackArray, setProjectTechStackArray] = useState([]);
    const [projectTechStackString, setProjectTechStackString] = useState("");
    const [projectMembers, setProjectMembers] = useState("")
    const [projectMembersArray, setProjectMembersArray] = useState([]);
    const [recommended, setRecommended] = useState([]);
    const email = localStorage.getItem("email");
    const navigate = useNavigate();

    function handleTitleChange(event){
        setProjectTitle(event.target.value);
    }
    function handleDescriptionChange(event){
        setProjectDescription(event.target.value);
    }
    function handleDueChange(event){
        setProjectDueDate((event.target.value).replace("T", " ") + ":00");
    }
    function handleTechStackChange(event){
        setProjectTechStack(event.target.value);
    }
    function handleMemberChange(event){
        setProjectMembers(event.target.value);
    }

    function handleAddTech(){
        setProjectTechStackArray(prev => [...prev, projectTechStack]);
        setProjectTechStack("");
    }

    function handleDeleteTech(index){
        setProjectTechStackArray(prev => prev.filter((tech, techIndex) => techIndex !== index));
    }

    function handleAddMember(){
        //look for that member in DB
        //if member doesnt exist alert user
        if(!searchMember()){
            setProjectMembers("");
            return;
        } 
    }

    //check if member exist
    function searchMember(){
        if(projectMembers === email){
            alert("You are already in the project silly!");
            return;
        }
        if(projectMembersArray.includes(projectMembers)){
            alert("This member is already added to the project.");
            return;
        }
        axios.post('http://localhost:8081/checkexist', { email: projectMembers })
        .then((res) => {
            if(res.data === "Success"){
                alert("User does not exist!");
                return false;
            }
            else{
                alert("User added to the project.");
                setProjectMembersArray(prev => [...prev, projectMembers]);
                setProjectMembers("");
                return true;
            }
        })
    }

    function addMemberReco(user_email){
        if(projectMembersArray.includes(user_email)){
            alert("This member is already added to the project.");
            return;
        }
        axios.post('http://localhost:8081/checkexist', { email: user_email })
        .then((res) => {
            if(res.data === "Success"){
                alert("User does not exist!");
                return false;
            }
            else{
                alert("User added to the project.");
                setProjectMembersArray(prev => [...prev, user_email]);
                setProjectMembers("");
                return true;
            }
        })
    }

    function addProject(){
        if(projectTitle.trim() === "" || projectDescription.trim() === "" || projectTechStackString.trim() === "" || email.trim() === "" ||projectDueDate.trim() === ""){
            alert("A field cannot be empty! Track your steps to check!");
            return;
        }
        const projectsData = [
            projectTitle, 
            projectDescription, 
            projectTechStackString, 
            email, 
            projectDueDate
        ];
    
        const query = projectsData.map((value, index) => `param${index}=${encodeURIComponent(value)}`).join('&');
    
        axios.get(`http://localhost:8081/getprojectid?${query}`)
            .then((res) => {
                console.log(res.data)
                if(res.data.length > 0){
                    alert("A project has the same values as you did. Change it up a little.");
                    existBool = false;
                }
                else{
                    insertProject();
                    getProjectId();
                    navigate('/ongoing');
                }
            })
            .catch((error) => console.log(error));
        
        setProjectTitle("");
        setProjectDescription("");
        setProjectDueDate("");
        setProjectTechStack("");
        setProjectTechStackArray([]);
        setProjectTechStackString("");
        setProjectMembers("");
        setProjectMembersArray([]);
    }

    function insertProject(){
        const projectsData = [projectTitle, projectDescription, projectTechStackString, email, projectDueDate];
        return axios.post('http://localhost:8081/add-project', { values: projectsData })
        .then((res) => {
            console.log(res.data);

        })
        .catch((err) => {
            console.log(err);
        });
    }

    async function getProjectId() {
        const projectsData = [
            projectTitle,
            projectDescription,
            projectTechStackString,
            email,
            projectDueDate
        ];
    
        const query = projectsData.map((value, index) => `param${index}=${encodeURIComponent(value)}`).join('&');
    
        try {
            const res = await axios.get(`http://localhost:8081/getprojectid?${query}`);
            console.log(res.data[0].project_id);
            addLeader(res.data[0].project_id);
            addMembers(res.data[0].project_id);
            alert("Project Successfully created.")
            return res.data[0]?.project_id || 0;
        } catch (error) {
            console.log(error);
            return 0; // Default to 0 in case of an error
        }
    }
    
    //adds the leader to the members table
    function addLeader(id){
        console.log("Project ID:", id);
        console.log("Email:", email);
        axios.post('http://localhost:8081/add-leader', { projectID: id, email })
        .then((res) => {
            console.log(`Leader Added: ${id} ${email}`);
        })
        .catch((error) => console.error("Request failed:", error));
    }

    //adds the members to the members table
    function addMembers(id) {
        // Loop through each email and send a POST request to add the member
        projectMembersArray.forEach((email) => {
            axios.post('http://localhost:8081/add-members', { projectId: id, user: email })
                .then((res) => {
                    console.log(`Successfully added ${email}:`, res.data.message);
                })
                .catch((error) => {
                    console.error(`Error adding ${email}:`, error.response ? error.response.data.message : error.message);
                });
        });
    }

    const fetchMatchingUsers = () => {
        if(projectTechStackArray.length > 0){
            const encodedSkills = projectTechStackArray.join(',');
            // Use axios to send a GET request with skills as a comma-separated string
            axios.get(`http://localhost:8081/get-reco?skills=${encodedSkills}&email=${email}`)
                .then((response) => {
                    console.log("Received response:", response.data);
                    setRecommended(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching matching users:", error);
                });
        }
        else{
            setRecommended([]);
        }
    };
    
    
    
    function debug(){
        console.log(`Title: ${projectTitle}`);
        console.log(`Description: ${projectDescription}`);
        console.log(`Due Date: ${projectDueDate}`);
        console.log(`Stack: ${projectTechStack}`);
        console.log(`Member: ${projectMembers}`);
        console.log(`Tech Array: ${projectTechStackArray}`);
        console.log(`Member Array: ${projectMembersArray}`);
        console.log(`Project ID: ${projectId.toString()}`);
    }

    useEffect(() => {
        const today = new Date();
        today.setMinutes(today.getMinutes() + 1);
        const formattedDateTime = today.toISOString().slice(0, 16); // "yyyy-mm-ddThh:mm"
        setMinDate(formattedDateTime);
    }, []);

    useEffect(() => {
        setProjectTechStackString(projectTechStackArray.join(","));
        fetchMatchingUsers();
        console.log(`Stack: ${projectTechStackArray}`)
    }, [projectTechStackArray])

    useEffect(() => {
        console.log(`Member ${projectMembersArray}`)
    }, [projectMembersArray]);

    return(
        <>
            <Navbar></Navbar>

            <section className={styles.container}>
                <div className={styles.sliderWrapper}>
                    <div className={styles.slider}>
                        
                        <div id='slide-1' className={styles.page} style={{backgroundColor: 'white'}}>

                            <h1>Enter a Project Title</h1>
                            <input type="text" onChange={handleTitleChange} value={projectTitle}/>

                        </div>

                        <div id='slide-2' className={styles.page} style={{backgroundColor: 'white'}}>

                            <h1>Project Description</h1>
                            <textarea class="description" placeholder="Enter description here..." onChange={handleDescriptionChange} value={projectDescription}></textarea>

                        </div>

                        <div id='slide-3' className={styles.page} style={{backgroundColor: 'white'}}>
                                
                            <h1>Due Date</h1>
                            <input type="datetime-local" min={minDate} onChange={handleDueChange} value={projectDueDate}/>

                        </div>

                        <div id='slide-4' className={styles.page} style={{backgroundColor: 'white'}}>
                                
                            <h1>Enter Tech Stack</h1>

                            <div className={styles.addContainer}>

                                <input type="text" id='#techtext' value={projectTechStack} onChange={handleTechStackChange}/>
                                <button onClick={handleAddTech}>Add</button>
                                
                            </div>

                            <div className={styles.techStackHolder}>

                                {projectTechStackArray.map((tech, index) => {
                                    return(
                                        <div className={styles.tech} key={index}>
                                        <p>{tech}</p>
                                        <button onClick={() => {handleDeleteTech(index)}}>
                                            -
                                        </button>
                                        </div>
                                    )
                                })}

                            </div>
                            
                        </div>

                        <div id='slide-5' className={styles.page} style={{backgroundColor: 'white'}}>
                                
                            <h1>Add Members</h1>
                            <div className={styles.addContainer}>

                                <input type="text" onChange={handleMemberChange} value={projectMembers}/>
                                <button onClick={handleAddMember}>Add</button>

                            </div>

                            <div className={styles.remarks}>
                                    <h1>Recommendations</h1>
                            </div>
                            <div className={styles.memberContainer}>
                                {recommended
                                    .filter(rec => rec.email !== email) // Filter out the record with the matching email
                                    .map((rec, index) => {
                                        return (
                                            <div className={styles.member} key={rec.id}>
                                                <div className={styles.memberNameContainer}>
                                                    <p>{rec.email}</p>
                                                </div>
                                                <div className={styles.memberSkillContainer}>
                                                    <p>{rec.skills}</p>
                                                </div>
                                                <button onClick={() => {addMemberReco(rec.email)}}>+</button>
                                            </div>
                                        );
                                    })}
                            </div>

                        </div>


                        
                        <div id='slide-6' className={styles.page} style={{backgroundColor: 'white'}}>
                                
                            <button className={styles.submit} onClick={addProject}>Create Project</button>

                        </div>
                        
                    </div>
                    <div className={styles.sliderNav}>
                        <a href="#slide-1"></a>
                        <a href="#slide-2"></a>
                        <a href="#slide-3"></a>
                        <a href="#slide-4"></a>
                        <a href="#slide-5"></a>
                        <a href="#slide-6"></a>
                    </div>
                </div>
            </section>

        </>
    );

}

export default AddProject