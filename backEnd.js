const express = require('express');
const supabase = require('@supabase/supabase-js');

const app = express();
const port = 3000;
app.use(express.static(__dirname + '/public'));
const supabaseUrl = 'https://luspwsueakmvkrnwkfhc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1c3B3c3VlYWttdmtybndrZmhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MTQ5NDAsImV4cCI6MjA2MzA5MDk0MH0.p370rJYHmVaDZSrjOcPvAiWi-Moq2E7G92OTBlqwkVQ'
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

app.get('/users', async (req, res) => {
    console.log('Attempting to GET all users')
    const { data, error } = await supabaseClient.from('users').select();
    if (error) {
        console.log('Error:', error); // Log full error for debugging
        // If the error code is 42P01 (undefined table), send 400 with a friendly message
        if (error.code === '42P01') {
            return res.status(400).json({ error: 'Error 400: Table does not exist.' });
        }
        // For other errors, send 400 with the error message
        return res.status(400).json({ error: error.message });
    }
    res.json(data);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});