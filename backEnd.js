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

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/home.html');
});

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

app.post('/users', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Username and password required.' });
    }
    try {
        const { data, error } = await supabaseClient
            .from('users')
            .select('id, uuid, username') // Only select id, uuid, username for response
            .eq('username', username)
            .eq('password', password)
            .maybeSingle(); // Use maybeSingle to avoid error if not found
        if (!data) {
            return res.status(401).json({ success: false, error: 'Invalid username or password.' });
        }
        res.json({ success: true, user: data });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error.' });
    }
});

// Fetch bookmarks for a user
app.get('/bookmarks', async (req, res) => {
    const { uuid } = req.query;
    if (!uuid) return res.status(400).json({ error: 'UUID required' });
    const { data, error } = await supabaseClient.from('bookmarks').select('jobId, html').eq('user_id', uuid);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Delete a bookmark for a user
app.delete('/bookmark', async (req, res) => {
    const { uuid, jobId } = req.body;
    if (!uuid || !jobId) return res.status(400).json({ error: 'UUID and jobId required' });
    const { error } = await supabaseClient.from('bookmarks').delete().eq('user_id', uuid).eq('jobId', jobId);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
});

// Add a bookmark for a user
app.post('/bookmark', async (req, res) => {
    const { uuid, jobId, html } = req.body;
    if (!uuid || !jobId || !html) {
        return res.status(400).json({ error: 'UUID, jobId, and html are required' });
    }
    const { error } = await supabaseClient
        .from('bookmarks')
        .insert([{ user_id: uuid, jobId: jobId.toString(), html }]);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});