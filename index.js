// const http = require('http');

let notes = [
                {
                "id": 1,
                "content": "HTML is easy",
                "date": "2019-05-30T17:30:31.098Z",
                "important": true
                },
                {
                "id": 2,
                "content": "Browser can execute only Javascript",
                "date": "2019-05-30T18:39:34.091Z",
                "important": false
                },
                {
                "id": 3,
                "content": "GET and POST are the most important methods of HTTP protocol",
                "date": "2019-05-30T19:20:14.298Z",
                "important": true
                }
            ]

// const app = http.createServer((req, res) => {
//     res.writeHead(200, { 'Content-Type': 'application/json' })
//     res.end(JSON.stringify(notes));
// })

// const port = 3001;
// app.listen(port);

// console.log(`server running on port ${port}`);

const requestLogger = (request, response, next) => {
    console.log('Method: ', request.method);
    console.log('Path: ', request.path);
    console.log('Body: ', request.body);
    console.log('------');
    next()
}

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

app.use(requestLogger);

app.use(express.static('build'));

app.get('/', (req, res) => {
    res.send('<h1>hello world</h1>')
})

app.get('/api/notes', (req, res) => {
    res.json(notes);
})

app.get('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    const note = notes.find(note => note.id === id);
    if(note){
        res.json(note);
    }else{
        res.status(404).end();
    }
})

app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    notes = notes.filter(note => note.id !== id);
    res.status(204).end();
})

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(note => note.id)) : 0;
    return maxId + 1;
} 

app.post('/api/notes', (req, res) => {
    
    const body = req.body;

    if(!body.content){
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId()
    }

    notes = notes.concat(note);

    res.json(note);
})

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

const unknownEndPoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndPoint);