// import users from "./users.js";
import * as usersDao from "./users-dao.js";
// only support single user login
// let currentUser = null;

// we use async to make sure the function is asynchronous
// and we use await to make sure the function is executed in order
function UsersController(app) {
    const findAllUsers = async (req, res) => {
        const users = await usersDao.findAllUsers();
        res.send(users);
    };
    const findUserById = async (req, res) => {
        const id = req.params._id;
        // const user = users.find((user) => user.id === id);
        const user = await usersDao.findUserById(id);
        res.send(user);
    };
    const deleteUserById = async (req, res) => {
        const id = req.params._id;
        // const user = users.find((user) => user.id === id);
        // const index = users.indexOf(user);
        // users.splice(index, 1);
        const status = await usersDao.deleteUser(id);
        res.json(status);
    };
    const createUser = async (req, res) => {
        // const user = req.body;
        // users.push({ ...user, id: new Date().getTime() });
        const user = await usersDao.createUser(req.body);
        res.json(user);
    };
    const updateUser = async (req, res) => {
        req.session.currentUser = req.body;
        console.log("updated", req.session);

        const status = await usersDao.updateUser(req.session.currentUser);
        res.json(status);
    };
    const login = async (req, res) => {
        const user = req.body;
        //console.log(user);
        const foundUser = await usersDao.findUserByCredentials(
            req.body.username,
            req.body.password
        );
        //console.log(foundUser);
        if (foundUser) {
            // use the key currentUser to store the user we found
            req.session["currentUser"] = foundUser;
            console.log("save session", req.session);
            // only support single user login
            // currentUser = foundUser;
            res.send(foundUser);
        } else {
            res.sendStatus(404);
        }
    };
    const logout = async (req, res) => {
        // directly destroy the user
        req.session.destroy();
        // only for single user logout
        // currentUser = null;
        res.sendStatus(204);
    };
    const profile = async (req, res) => {
        // if there is an user in the session, return the user
        const currentUser = req.session["currentUser"];
       // console.log("profile", currentUser);
        if (currentUser) {
            res.send(currentUser);}
    };

    const register = async (req, res) => {
        const user = req.body;
        // const foundUser = users.find((user) => user.username === req.body.username);
        const foundUser = await usersDao.findUserByUsername(req.body.username);
        if (foundUser) {
            res.sendStatus(409);
        } else {
            // const newUser = { ...user, id: new Date().getTime() };
            const newUser = await usersDao.createUser(user);
            req.session["currentUser"] = newUser;
            // currentUser = newUser;
            // users.push(newUser);
            res.json(newUser);
        }
    };

    app.post("/api/users/login", login);
    app.post("/api/users/logout", logout);
    app.get("/api/users/profile", profile);
    app.post("/api/users/register", register);

    app.get("/api/users", findAllUsers);
    app.get("/api/users/:id", findUserById);
    app.delete("/api/users/:id", deleteUserById);
    app.post("/api/users", createUser);
    app.put("/api/users/:id", updateUser);
}

export default UsersController;