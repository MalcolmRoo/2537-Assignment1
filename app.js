require('node:dns/promises').setServers(['1.1.1.1', '8.8.8.8']);
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo').default; 
const bcrypt = require('bcrypt');
const saltRounds = 12;

const app = express();
const PORT = process.env.PORT || 3000;
const expireTime = 24 * 60 * 60 * 1000;


var users = [];

const mongodb_host = process.env.HOST;
const mongodb_user = process.env.USER;
const mongodb_password = process.env.DATABASE_PASS;
const mongodb_database = "sessions";

const node_session_secret = process.env.NODE_SECRET;

app.use(express.urlencoded({extended: false}));

var mongoStore = MongoStore.create({
    mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/${mongodb_database}`,
    crypto: {
        secret: "secret"
    }
})

app.use(session({
    secret: node_session_secret,
    store: mongoStore,
    saveUninitialized: false,
    resave: true
}));

//Routes
app.get('/', (req, res) => {
    var html = "";
    if(!req.session.authenticated){
        html = `
        <div>
            <h1>My Site</h1>
            <a href="/login"><button>Login</button></a>
            <a href="/signup"><button>Sign Up</button></a>
        </div>
        `;
    } else {
        html = `
        <div>
            <h1>My Site</h1>
            <a href="/members"><button>Members Area</button></a>
            <a href="/logout"><button>Log Out</button></a>
        </div>
        `;
    }
    res.send(html);
});

app.get('/login', (req, res) => {
    res.send(`
        <div>
            <h1>Login</h1>
            <form method="post" action="/loginSubmit">
                <input type="text" name="username" id="username" placeholder="username"></input>
                <input type="password" name="password" id="password" placeholder="password"></input>
                <button>Login</button>
            </form>
        </div>
        `);
});

app.get('/signup', (req, res) => {
    res.send(`
    <div>
        <h1>Sign up</h1>
        <form method="post" action="/signupSubmit">
            <input type="text" name="username" id="username" placeholder="username"></input>
            <input type="email" name="email" id="email" placeholder="email"></input>
            <input type="password" name="password" id="password" placeholder="password"></input>
            <button>Submit</button>
        </form>
    </div>
        `);
});

app.post('/loginSubmit', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    for(i = 0; i < users.length; i++){
        if(users[i].username == username) {
            if(bcrypt.compareSync(password, users[i].password)) {
                req.session.authenticated = true;
                req.session.username = username;
                req.
                res.redirect('/');
                return;
            }
        }
    }

    res.redirect("/login");
});

app.post('/signupSubmit', (req, res) => {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    var hashedPassword = bcrypt.hashSync(password, saltRounds);

    users.push({username: username, email: email, password: hashedPassword});

    res.send(`
        <p>user: ${users[0].username} email: ${users[0].email} pass: ${users[0].password}</p>
        `);
});

app.get('/members', (req,res) => {
    var html = "";
    if(!req.session.authenticated){
        html = `
            <p>You are not logged in</p>
            <a href="/"><button>return to home</button></a>
        `;
    } else {
        html = `
        <p> Hello!!</p>
        <img src="/fluffy.gif"/>
        `
    }
    res.send(html);
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.send(`<p>You are logged out</p>`);
    redirect("/");
});

app.use(express.static(__dirname + "/public"));

app.use((req, res) => {
    res.status(404);
    res.send(`<h1>Page not Found - 404</h1>`);
})

//Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});