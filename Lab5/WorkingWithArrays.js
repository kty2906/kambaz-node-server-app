let todos = [
    { id: 1, title: "Task 1", completed: false, description: "First task" },
    { id: 2, title: "Task 2", completed: true, description: "Second task" },
    { id: 3, title: "Task 3", completed: false, description: "Third task" },
    { id: 4, title: "Task 4", completed: true, description: "Fourth task" },
  ];
  
  export default function WorkingWithArrays(app) {
    // Get all todos or filter by completed status
    app.get("/lab5/todos", (req, res) => {
      const { completed } = req.query;
      if (completed !== undefined) {
        const completedBool = completed === "true";
        const completedTodos = todos.filter((t) => t.completed === completedBool);
        res.json(completedTodos);
        return;
      }
      res.json(todos);
    });
  
    // Get todo by ID
    app.get("/lab5/todos/:id", (req, res) => {
      const { id } = req.params;
      const todo = todos.find((t) => t.id === parseInt(id));
      res.json(todo);
    });
  
    // Create new todo (GET version)
    app.get("/lab5/todos/create", (req, res) => {
      const newTodo = {
        id: new Date().getTime(),
        title: "New Task",
        completed: false,
        description: "New task description"
      };
      todos.push(newTodo);
      res.json(todos);
    });
  
    // Create new todo (POST version)
    app.post("/lab5/todos", (req, res) => {
      const newTodo = { ...req.body, id: new Date().getTime() };
      todos.push(newTodo);
      res.json(newTodo);
    });
  
    // Delete todo (GET version for lab)
    app.get("/lab5/todos/:id/delete", (req, res) => {
      const { id } = req.params;
      const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
      if (todoIndex === -1) {
        res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });
        return;
      }
      todos.splice(todoIndex, 1);
      res.json(todos);
    });
  
    // Delete todo (DELETE version)
    app.delete("/lab5/todos/:id", (req, res) => {
      const { id } = req.params;
      const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
      if (todoIndex === -1) {
        res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });
        return;
      }
      todos.splice(todoIndex, 1);
      res.sendStatus(200);
    });
  
    // Update todo title (GET version for lab)
    app.get("/lab5/todos/:id/title/:title", (req, res) => {
      const { id, title } = req.params;
      const todo = todos.find((t) => t.id === parseInt(id));
      if (todo) {
        todo.title = title;
        res.json(todos);
      } else {
        res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
      }
    });
  
    // Update todo completed status
    app.get("/lab5/todos/:id/completed/:completed", (req, res) => {
      const { id, completed } = req.params;
      const todo = todos.find((t) => t.id === parseInt(id));
      if (todo) {
        todo.completed = completed === "true";
        res.json(todos);
      } else {
        res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
      }
    });
  
    // Update todo description
    app.get("/lab5/todos/:id/description/:description", (req, res) => {
      const { id, description } = req.params;
      const todo = todos.find((t) => t.id === parseInt(id));
      if (todo) {
        todo.description = description;
        res.json(todos);
      } else {
        res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
      }
    });
  
    // Update todo (PUT version)
    app.put("/lab5/todos/:id", (req, res) => {
      const { id } = req.params;
      const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
      if (todoIndex === -1) {
        res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
        return;
      }
      todos = todos.map((t) => {
        if (t.id === parseInt(id)) {
          return { ...t, ...req.body };
        }
        return t;
      });
      res.sendStatus(200);
    });
  }