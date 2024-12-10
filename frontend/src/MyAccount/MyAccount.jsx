import styles from "./MyAccount.module.css";
import Navbar from "../Navbar/Navbar.jsx";
import idImage from '../assets/id.png';
import nameImage from '../assets/fullname.png';
import emailImage from '../assets/username.png';
import passImage from '../assets/password.png';
import delImage from '../assets/delete.png';
import addImage from '../assets/add-icon.png';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from "axios";

function MyAccount() {

    //prepare variables the will be updated later on using useState
    const [userInfo, setUserInfo] = useState([]);
    const [isLoadingInfo, setIsLoadingInfo] = useState(true);
    const [userSkillsArray, setUserSkillsArray] = useState([]);
    const [newSkill, setNewSkill] = useState("");
    const [isLoadingSkills, setIsLoadingSkills] = useState(true);

    //prepare variables that is necessary for logic of the page
    const location = useLocation();
    const email = localStorage.getItem('email');

    //change the value of newSkill when the user types something to the input box
    function handleNewSkillChange(event){
        setNewSkill(event.target.value);
    }

    //when a skill is added     
    function addSkill(){    
        if(newSkill === ""){ 
            alert("This field cannot be empty!");
            return;
        }
        setUserSkillsArray(prevSkills => {
            const updatedSkills = [...prevSkills, newSkill];
            return updatedSkills;
        });

        setNewSkill("");
    }

    //used when deleting a skill
    function deleteSkill(index){
        const updatedSkills = [...userSkillsArray];
        updatedSkills.splice(index, 1);
        setUserSkillsArray(updatedSkills);
    }

    //load the user information upon the load of the page
    useEffect(() => {
        axios
            .get('http://localhost:8081/user-info', { params: { email } })
            .then((res) => {
                setUserInfo(res.data); 
                setIsLoadingInfo(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoadingInfo(false);
            });
    }, [location]);
    
    //load the user skill upon the load of the page
    useEffect(() => {
        axios.get('http://localhost:8081/user-skills', { params: { email } })
            .then((res) => {
                let skillArray = []; 
                if (res.data.length > 0) {
                    const skillString = res.data[0]?.skills;
                    if (skillString) {
                        skillArray = skillString.split(',').map(skill => skill.trim());
                    }
                }
                setUserSkillsArray(skillArray);
                setIsLoadingSkills(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoadingSkills(false);
            });
    }, [location]);
    
    //Everytime the array storing the skills are updated, update the skills in the database
    useEffect(() => {
        if (userSkillsArray.length > 0) {
            // Make sure that userSkills is a valid array of strings
            console.log(`Updated skills: ${userSkillsArray.join(', ')}`);
            axios.post('http://localhost:8081/add-skill', { skill: userSkillsArray.join(','), email });
        }
    }, [userSkillsArray]); 

    return (
        <>
            <Navbar></Navbar>

            <div className={styles.mainContainer}>
                <div className={styles.personalInfoDiv}>
                    <div className={styles.personalInfoRemarks}>
                        <h1>Personal Information</h1>
                    </div>

                    {/* Conditional Rendering: Show "Fetching..." while loading */}
                    {isLoadingInfo ? (
                        <p>Fetching...</p>
                    ) : (
                        userInfo.length > 0 && (
                            <>
                                <div className={styles.idContainer}>
                                    <div className={styles.imageHolder}>
                                        <img src={idImage} alt="id" />
                                    </div>
                                    <div className={styles.valuesContainer}>
                                        <p className={styles.displayValue}>{userInfo[0].id}</p>
                                    </div>
                                </div>

                                <div className={styles.nameContainer}>
                                    <div className={styles.imageHolder}>
                                        <img src={nameImage} alt="name" className={styles.imgName} />
                                    </div>
                                    <div className={styles.valuesContainer}>
                                        <p className={styles.displayValue}>{userInfo[0].name}</p>
                                    </div>
                                </div>

                                <div className={styles.emailContainer}>
                                    <div className={styles.imageHolder}>
                                        <img src={emailImage} alt="name" className={styles.imgName} />
                                    </div>
                                    <div className={styles.valuesContainer}>
                                        <p className={styles.displayValue}>{userInfo[0].email}</p>
                                    </div>
                                </div>

                                <div className={styles.passwordContainer}>
                                    <div className={styles.imageHolder}>
                                        <img src={passImage} alt="name" className={styles.imgName} />
                                    </div>
                                    <div className={styles.valuesContainer}>
                                        <p className={styles.displayValue}>
                                            {userInfo[0]?.password ? '●'.repeat(userInfo[0].password.length) : ''}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )
                    )}
                    <Link to='/editaccount' className={styles.buttonContainer}>
                    <div className={styles.buttonContainer}>
                        <button>Edit Account</button>
                    </div>
                    </Link>
                   
                </div>

                <div className={styles.skillsContainer}>
                    
                    <div className={styles.skillRemarksContainer}>
                        <h1>Your Skills:</h1>
                    </div>

                    <div className={styles.addContainer}>

                        <div className={styles.inputContainer}>
                            <input type="text" placeholder="Add a Skill" value={newSkill} onChange = {handleNewSkillChange} id="newSkillInput"/>
                        </div>

                        <div className={styles.addSkill}>
                            <img src={addImage} alt="" onClick={addSkill} />
                        </div>

                    </div>

                    <div className={styles.allSkillsContainer}>
                        {isLoadingSkills ? (
                            <p>Fetching...</p>
                        ) : (
                            userSkillsArray.length > 0 && (
                                <>
                                    {userSkillsArray.map((skill, index) => (
                                        <div className={styles.skills} key={index}>

                                            <div className={styles.skillText}>
                                                <p>{skill}</p>
                                            </div>

                                            <div className={styles.delSkill}>
                                                <img src={delImage} onClick={() => deleteSkill(index)} className={styles.deleteImage}/>
                                            </div>

                                        </div>
                                    ))}
                                </>
                            )
                        )}
                    </div>

                    

                   

                </div>
            </div>
        </>
    );
}

export default MyAccount;