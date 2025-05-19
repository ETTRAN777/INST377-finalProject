const express = require('express');
const supabase = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

app.get('/users', async (req, res) => {
    console.log('Attempting to GET all users')
    const { data, error } = await supabaseClient.from('users').select();
    if (error) {
        console.log('Error:', error);
        res.statusCode = 400;
        res.send(error);
    }
    res.json(data);
});

app.post('/user', async (req, res) => {
    console.log("Adding User");
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    const { data, error } = await supabaseClient
        .from('users')
        .insert({ username: username, password: password })
        .select();
         if (error) {
            console.log('Error:', error);
            res.statusCode = 500;
            res.send(error);
        }
        res.send(data);
    });

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});