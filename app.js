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
        secret: process.env.MONGO_SESSION_SECRET
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
            <h1>Hello, ${users[0].username}</h1>
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
                <input type="email" name="email" id="email" placeholder="email"></input>
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
    var email = req.body.email;
    var password = req.body.password;
    var username = req.body.username;

    for(i = 0; i < users.length; i++){
        if(users[i].email == email) {
            if(bcrypt.compareSync(password, users[i].password)) {
                req.session.authenticated = true;
                req.session.username = username;
                req.session.expireTime = expireTime;

                res.redirect('/');
                return;
            }
        }
    }

    res.send(`
        <p>Invalid email/password combintation.</p>
        <a href="/login"><button>Try Again</button></a>
        `);
});

app.post('/signupSubmit', (req, res) => {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    var html = "";
    if(!username){
        html += `<p>Name is required</p>
        <a href="/signup"><button>Try Again</button></a>`;   
    } else if (!email) {
         html += `<p>Email is required</p>
        <a href="/signup"><button>Try Again</button></a>`;
    } else if (!password){
         html += `<p>Password is required</p>
        <a href="/signup"><button>Try Again</button></a>`;
    } else {
       var hashedPassword = bcrypt.hashSync(password, saltRounds);
        users.push({username: username, email: email, password: hashedPassword});
        res.redirect("/");
    }

    res.send(html);
});

app.get('/members', (req,res) => {
    var html = "";
    let num = Math.floor(Math.random() * 3);
    if(!req.session.authenticated){
        html = `
            <p>You are not logged in</p>
            <a href="/"><button>return to home</button></a>
        `;
    } else {
        html = `
        <p> Hello ${users[0].username}!!</p>`;
        if(num === 0){
            html += `<img src="/fluffy.gif"/>`;
        } else if (num === 1){
            html += `<img src="/socks.gif"/>`;
        } else if (num === 2){
            html += `<img src="/crunchy.gif"/>`;
        }
        
        html += `</br><a href="/logout"><button>Logout</button></a>
        `;
    }
    res.send(html);
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.send(`
        <p>You are logged out</p>
        <a href="/"><button>home</button></a>
        `);
});

app.use(express.static(__dirname + "/public"));

app.use((req, res) => {
    res.status(404);
    res.send(`<h1>Page not Found - 404</h1>
            <a href="/"><button>Home</button></a>`);
})

//Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});