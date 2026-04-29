const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

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
            <form action="post">
                <input type="text" name="username" id="username" placeholder="username"></input>
                <input type="password" name="password" id="password" placeholder="password"></input>
                <a href="/"><button>Login</button></a>
            </form>
        </div>
        `);
});

app.get('/signup', (req, res) => {
    res.send(`
        <div>
            <h1>Sign up</h1>
            <form action="post">
                <input type="text" name="username" id="username" placeholder="username"></input>
                <input type="email" name="email" id="email" placeholder="email"></input>
                <input type="password" name="password" id="password" placeholder="password"></input>
                <a href="/login"><button>Submit</button></a>
            </form>
            </div>
        `);
});

//Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});