/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Rojan KC Student ID: 171714231 Date: 2024/06/15
*
*  Published URL: ___________________________________________________________
*
********************************************************************************/

const express = require("express");
const path = require("path");
const cors = require("cors");
const projectData = require("./modules/projects");


const app = express();
const port = process.env.PORT || 3000;


app.use(cors()); //allow cross-origin requests
app.use(express.json()); //parse JSON bodies
app.use(express.urlencoded({ extended: true })); //parse URL-encoded bodies forms
app.use(express.static(path.join(__dirname, "public")));


projectData
    .Initialize()
    .then(() => {
        console.log("Projects initialized successfully.");
    })
    .catch((error) => {
        console.error("Error initializing projects:");
    });

app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/about", (request, response) => {
  response.sendFile(path.join(__dirname, "views", "about.html"));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));

});

app.get("/solutions/projects/", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (!req.query.sector) {
        return res.status(400).json({ error: "Sector query parameter is required." });
    }
    const projectSector = req.query.sector; //known projectSector value from sectorData

    projectData
        .getProjectsBySector(projectSector.toLowerCase())
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.sendFile(path.join(__dirname, "views", "404.html"));
        });
});

app.get("/solutions/projects/:id", (req, res) => {
    res.setHeader("Content-Type", "application/json");

    const projectId = req.params.id; //known projectId value from projectData

    projectData
        .getProjectsById(parseInt(projectId, 10))
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
             res.sendFile(path.join(__dirname, "views", "404.html"));
        });
});

 

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app; 
