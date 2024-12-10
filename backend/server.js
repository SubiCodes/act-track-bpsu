//initialize the required imports
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

//create app variable that uses the imports
const app = express();
app.use(cors());
app.use(express.json());

//create connection to the mysql
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'act-track'
});

//api for loggin in new users
app.post('/signup', (req, res) => {
    const query = "INSERT INTO user (`name`, `email`, `password`) VALUES (?)"
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ];
    db.query(query, [values], (error, data) => {
        if(error) {
            return res.json("Error");
        }
        return res.json(data)
    })
});

//api for checking corredt credentials
app.post('/login', (req, res) => {
    const query = "SELECT * FROM user WHERE `email` = ? AND `password` = ?"
    db.query(query, [req.body.email, req.body.password], (error, data) => {
        if(error) {
            return res.json("Error");
        }
        if(data.length  > 0){
            return res.json("Success");
        } else{
            return res.json("Failed")
        }
    })
});

//api to check if email already exist
app.post('/checkexist', (req, res) => {
    const query = "SELECT * FROM user WHERE `email` = ?"
    db.query(query, [req.body.email], (error, data) => {
        if(error) {
            return res.json("Error");
        }
        if(data.length === 0){
            return res.json("Success");
        } else{
            return res.json("Failed")
        }
    })
});

//get project id's of the projects the user is participating in.
app.get('/projects', (req, res) => {
    const { email } = req.query;
    const sql = 'SELECT `project_id` FROM project_members WHERE `user_email` = ?';
    db.query(sql, [email], (error, data) => {
        if (error) {
            return res.status(500).json({ "Message": "Server Error" });
        }
        res.json(data);
    });
});

//get information of the ongoing projects
app.get('/project', (req, res) => {
    const projectIds = req.query.projects;
    if (!projectIds || projectIds.length === 0) {
        return res.status(400).json({ message: 'No project IDs provided' });
    }

    const sql = `
        SELECT 
            p.*, 
            COUNT(CASE WHEN t.status != 'Ongoing' THEN 1 END) AS done_count,
            COUNT(CASE WHEN t.status = 'Ongoing' THEN 1 END) AS not_done_count
        FROM 
            projects p
        LEFT JOIN 
            tasks t ON p.project_id = t.project_id
        WHERE 
            p.project_id IN (${projectIds.join(', ')})
            AND p.status = 'Ongoing'
        GROUP BY 
            p.project_id;
        `;
    db.query(sql, [projectIds], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Server Error" });
        }
        return res.json(result);
    });
});

//get information of the completed projects
app.get('/project-done', (req, res) => {
    const projectIds = req.query.projects;
    
    if (!projectIds || projectIds.length === 0) {
        return res.status(400).json({ message: 'No project IDs provided' });
    }

    // Construct placeholders for the IN clause (e.g. '?, ?, ?')
    const placeholders = projectIds.map(() => '?').join(', ');

    // Create the query with placeholders
    const sql = `SELECT * FROM projects WHERE project_id IN (${placeholders}) AND status != 'Ongoing'`;

    // Execute the query with projectIds as parameters
    db.query(sql, projectIds, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Server Error" });
        }
        return res.json(result);
    });
});

//get user information
app.get('/user-info', (req, res) => {
    const { email } = req.query;
    const sql = `SELECT id, name, email, password FROM user WHERE email = ?`;

    db.query(sql, email, (err, result) => {
        if(err){
            return res.status(500).json({ message: "Server Error" });
        }
        return res.json(result)
    });
});

//get user skills
app.get('/user-skills', (req, res) => {
    const { email } = req.query;
    const sql = `SELECT skills FROM user WHERE email = ?`

    db.query(sql, email, (err,result) => {
        if(err){
            return res.status(500).json( {message: "Server Error"} )
        }
        return res.json(result);
    });
});



//add skills to the database
app.post('/add-skill', (req, res) => {
    const { skill, email } = req.body; // Assuming the client sends these in the request body
    const query = "UPDATE user SET skills = ? WHERE email = ?";
    db.query(query, [skill, email], (error, data) => { 
        if (error) {
            return res.json("Error");
        }
        return res.json(data);
    });
});

//update the username of user
app.post('/change-username', (req, res) => {
    const { name, email }  = req.body;
    const sql = "UPDATE user SET name = ? WHERE email = ?"
    db.query(sql, [name, email], (err, data) => {
        if(err){
            return res.json("Error");
        }
        return res.json(data);
    });
});

//get the username of user
app.get('/get-username', (req, res) => {
    const email   = req.query.email;
    const sql = "SELECT name FROM user WHERE email = ?"
    db.query(sql, [email], (err, data) => {
        if(err){
            return res.json("Error");
        }
        return res.send(data[0].name);
    });
});

//get the password of user
app.get('/get-password', (req, res) => {
    const email   = req.query.email;
    const sql = "SELECT password FROM user WHERE email = ?"
    db.query(sql, [email], (err, data) => {
        if(err){
            return res.json("Error");
        }
        return res.send(data[0].password);
    });
});

//update the password of user
app.post('/change-password', (req, res) => {
    const { password, email }  = req.body;
    const sql = "UPDATE user SET password = ? WHERE email = ?"
    db.query(sql, [password, email], (err, data) => {
        if(err){
            return res.json("Error");
        }
        return res.json(data);
    });
});

//add a project to the system
app.post('/add-project', (req, res) => {
    const values = req.body.values;
    const sql = "INSERT INTO projects (project_title, project_description, tech_stack, created_by, due_date) VALUES (?)";
    db.query(sql, [values], (err, data) =>{
        if(err){
            return res.json("Error");
        }
        return res.json("Successful Insertion of project");
    })
})

//delete a project
app.post('/delete-project', (req, res) => {
    const { projectId } =  req.body;
    const sql = "DELETE FROM projects WHERE project_id = ?";
    db.query(sql, projectId, (err, data) => {
        if(err){
            return res.json(`Database Error: "${err}"`);
        } 
        return res.json(`Deleted project "${projectId}" successfully`);
    });
});

//delete project_members
app.post('/delete-members', (req, res) => {
    const { projectId } =  req.body;
    const sql = "DELETE FROM project_members WHERE project_id = ?";
    db.query(sql, projectId, (err, data) => {
        if(err){
            return res.json(`Database Error: "${err}"`);
        } 
        return res.json(`Deleted project "${projectId}" successfully`);
    });
});

//delete all task
app.post('/delete-alltask', (req, res) => {
    const { projectId } =  req.body;
    const sql = "DELETE FROM tasks WHERE project_id = ?";
    db.query(sql, projectId, (err, data) => {
        if(err){
            return res.json(`Database Error: "${err}"`);
        } 
        return res.json(`Deleted project "${projectId}" successfully`);
    });
});


//get project through all data's
app.get('/getprojectid', (req, res) => {
    const values = [
        req.query.param0, 
        req.query.param1, 
        req.query.param2,
        req.query.param3, 
        req.query.param4  
    ];

    const sql = `
        SELECT project_id 
        FROM projects 
        WHERE project_title = ? AND project_description = ? AND tech_stack = ? 
        AND created_by = ? AND due_date = ?`;

    db.query(sql, values, (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: err.message });
        }
        return res.json(data);
    });
});

//add the creator to the project
app.post('/add-leader', (req,res) => {
    const {projectID, email}  = req.body;
    const sql = "INSERT INTO project_members (project_id, user_email, role) VALUES (? , ? , 'owner') "
    db.query(sql, [ projectID ,email ], (err, data) => {
        if(err){
            return res.json("Error");
        }
        return res.json("Successful adding of leader");
    });
})

//add members to the project
app.post('/add-members', (req, res) => {
    const { projectId, user } = req.body; 

    const sql = "INSERT INTO project_members (project_id, user_email, role) VALUES (?, ?, 'member')";

    db.query(sql, [projectId, user], (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: "Failed to add member", error: err.message });
        }
        return res.status(200).json({ success: true, message: `Member ${user} added successfully` });
    });
});

app.get('/project-dash', (req, res) => {
    const { project_id } = req.query;
    const sql = `
        SELECT 
            p.*,
            COUNT(t.project_id) AS total_tasks,
            COUNT(CASE WHEN t.status != 'Ongoing' THEN 1 END) AS done_tasks,
            COUNT(CASE WHEN t.status = 'Ongoing' THEN 1 END) AS ongoing_tasks
        FROM 
            projects p
        LEFT JOIN 
            tasks t ON p.project_id = t.project_id
        WHERE 
            p.project_id = ?
        GROUP BY 
            p.project_id;
    `;
    db.query(sql, [project_id], (err, data) => {
        if (err) {
            console.error("Database Error: ", err);
            return res.status(500).json({ error: 'Database Error' });
        }
        return res.json(data);
    });
});

app.get('/get-task-leader', (req, res) => {
    const { project_id } = req.query;
    const sql = "SELECT * FROM tasks WHERE project_id = ? ORDER BY status = 'Ongoing' DESC;";
    db.query(sql, project_id, (err, data) => {
        if (err){
            console.error("Database Error: ", err)
            return res.status(500).json({ error: 'Database Error' });
        }
        return res.json(data);
    });
});

//get members in the project
app.get('/get-members', (req, res) => {
    const { project_id, email } = req.query;
    const sql = "SELECT user_email FROM project_members WHERE project_id = ? AND user_email != ?"
    db.query(sql, [project_id, email], (err, data) => {
        if (err){
            console.error("Database Error: ", err)
            return res.status(500).json({ error: 'Database Error' });
        }
        return res.json(data);
    });
});

//get task through all data's
app.get('/gettaskid', (req, res) => {
    const values = [
        req.query.param0, 
        req.query.param1, 
        req.query.param2,
        req.query.param3, 
    ];

    const sql = `
        SELECT task_id 
        FROM tasks 
        WHERE project_id = ? AND description = ? AND assigned_to = ? 
        AND due_date = ?`;

    db.query(sql, values, (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: err.message });
        }
        return res.json(data);
    });
});

//add the task to the database
app.post('/add-task', (req, res) => {
    const { project_id, description, assignment, due } = req.body; 

    const sql = "INSERT INTO tasks (project_id, description, assigned_to, due_date) VALUES (?, ?, ?, ?)";

    db.query(sql, [project_id, description, assignment, due], (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: "Failed to add task", error: err.message });
        }
        return res.status(200).json({ success: true, message: `Task ${description} added successfully` });
    });
});


//remove task
app.post('/delete-task', (req, res) => {
    const { task_id } = req.body; 

    const sql = "DELETE FROM tasks WHERE task_id = ?";

    db.query(sql, task_id, (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: "Failed to delete task", error: err.message });
        }
        return res.status(200).json({ success: true, message: `Deleted ${task_id} successfully` });
    });
});



//get tasks exclusively for the member
app.get('/get-task-member', (req, res) => {
    const { project_id, email } = req.query;
    const sql = "SELECT * FROM tasks WHERE project_id = ? AND assigned_to = ? ORDER BY status = 'Ongoing' DESC;";
    db.query(sql, [project_id, email], (err, data) => {
        if (err){
            console.error("Database Error: ", err)
            return res.status(500).json({ error: 'Database Error' });
        }
        return res.json(data);
    });
});

//get data for member
app.get('/project-dash-member', (req, res) => {
    const { project_id, email } = req.query;
    const sql = `
        SELECT 
    p.*,
    COUNT(t.project_id) AS total_tasks,
    COUNT(CASE WHEN t.status != 'Ongoing' THEN 1 END) AS done_tasks,
    COUNT(CASE WHEN t.status = 'Ongoing' THEN 1 END) AS ongoing_tasks
    FROM 
        projects p
    LEFT JOIN 
        tasks t ON p.project_id = t.project_id AND t.assigned_to = ?
    WHERE 
        p.project_id = ?
    GROUP BY 
        p.project_id;
    `;
    db.query(sql, [email, project_id], (err, data) => {
        if (err) {
            console.error("Database Error: ", err);
            return res.status(500).json({ error: 'Database Error' });
        }
        return res.json(data);
    });
});

//update task to done or done late
app.post('/mark-as-done', (req, res) => {
    const { status, task_id } = req.body;
    const sql = "UPDATE tasks SET status = ? WHERE task_id = ?;";
    db.query(sql, [status, task_id], (err, data) => {
        if (err) {
            console.error("Database Error: ", err);
            return res.status(500).json({ error: 'Database Error' });
        } else {
            console.log(`Successful Update on task ${task_id} with status ${status}`);
            return res.status(200).json({ message: 'Task updated successfully' });
        }
    });
});

//mark a project as done
app.post('/mark-done', (req, res) => {
    const { status, done_date, project_id } = req.body;
    const sql = "UPDATE projects SET status = ?, completed_at = ? WHERE project_id = ?;";
    
    db.query(sql, [status, done_date, project_id], (err, data) => {
        if (err) {
            console.error("Backend Error", err);
            return res.status(500).json({ error: err.message });
        }
        
        console.log("Successful update", data);
        return res.json("Successfully labeled done.");
    });
});

app.get('/get-reco', (req, res) => {
    const skillsArray = req.query.skills ? req.query.skills.split(',') : [];

    if (skillsArray.length === 0) {
        return res.status(400).json({ message: "Skills array cannot be empty" });
    }

    // Construct the REGEXP conditions for exact word matching
    const likeConditions = skillsArray.map(skill => `skills REGEXP ?`).join(' OR ');

    // Create the values array for exact word matching
    const values = skillsArray.map(skill => `\\b${skill}\\b`);

    const sql = `SELECT * FROM user WHERE ${likeConditions}`;

    db.query(sql, values, (err, data) => {
        if (err) {
            console.error("Backend Error", err);
            return res.status(500).json({ error: "Database query error" });
        }
        return res.json(data);
    });
});





//make the app use the localhost8081 port
app.listen(8081, ()=> {
    console.log("Listening")
})