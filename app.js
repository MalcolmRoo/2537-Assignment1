const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: false}));

//Routes
app.get('/', (req, res) => {
    res.send(`
        <div>
            <h1>My Site</h1>
            <a href="/login"><button>Login</button></a>
            <a href="/signup"><button>Sign Up</button></a>
        </div>
        `);
});

app.get('/login', (req, res) => {
    res.send(`
        <div>
            <h1>Login</h1>
            <form method="post" action="/loggingin">
                <input type="text" name="username" id="username" placeholder="username"></input>
                <input type="password" name="password" id="password" placeholder="password"></input>
                <button>Login</button>
            </form>
        </div>
        `);
});

app.get('/signup', (req, res) => {
    var missingInput = req.query.missing;
    var html = `
    <div>
        <h1>Sign up</h1>
        <form method="post" action="/createAccount">
            <input type="text" name="username" id="username" placeholder="username"></input>
            <input type="email" name="email" id="email" placeholder="email"></input>
            <input type="password" name="password" id="password" placeholder="password"></input>
            <button>Submit</button>
        </form>
    </div>
        `;

    if(missingInput){
        html += "</br> Please fill all inputs!"
    }
    res.send(html);
});

app.post('/loggingin', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    res.send(`
        <p> user: ${username} pass: ${password} </p>
        `);
});

app.post('/createAccount', (req, res) => {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    res.send(`
        <p>user: ${username} email: ${email} pass: ${password}</p>
        `);
});

app.use((req, res) => {
    res.status(404);
    res.send(`<h1>Page not Found - 404`);
})

//Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});