const assignment = {
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
  };
  
  const module = {
    id: "M101",
    name: "Introduction to Node.js",
    description: "Learn the basics of Node.js",
    course: "CS5610",
  };
  
  export default function WorkingWithObjects(app) {
    // Get assignment
    app.get("/lab5/assignment", (req, res) => {
      res.json(assignment);
    });
  
    // Get assignment title
    app.get("/lab5/assignment/title", (req, res) => {
      res.json(assignment.title);
    });
  
    // Update assignment title
    app.get("/lab5/assignment/title/:newTitle", (req, res) => {
      const { newTitle } = req.params;
      assignment.title = newTitle;
      res.json(assignment);
    });
  
    // Get module
    app.get("/lab5/module", (req, res) => {
      res.json(module);
    });
  
    // Get module name
    app.get("/lab5/module/name", (req, res) => {
      res.json(module.name);
    });
  
    // Update module name
    app.get("/lab5/module/name/:newName", (req, res) => {
      const { newName } = req.params;
      module.name = newName;
      res.json(module);
    });
  }