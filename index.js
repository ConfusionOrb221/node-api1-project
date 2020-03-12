// implement your API here
const express = require('express');
const db = require('./data/db');

const server = express();

server.listen(4000, () => console.log('API running on port 4000'));

server.use(express.json());

server.get('/', (req, res) =>{
    res.send('Hello World');
});

server.post('/api/users', (req, res) =>{
    const info = req.body;
    console.log(info);
    if(info.name === undefined || info.bio === undefined){
        res.status(400).json({ success: false, errorMessage: "Please provide name and bio for the user." });
    }
    else{
        db.insert(info)
        .then(hub =>{
            res.status(201).json({success: true, user: {...info, ...hub}});
        })
        .catch(err => {
            res.status(500).json({success: false, errorMessage: "There was an error while saving the user to the database" });
        })
    }
    
});

server.get('/api/users', (req,res) =>{
    db.find()
        .then(user =>{
            res.status(200).json({success: true, user: user})
        })
        .catch(err =>{
            res.status(500).json({success: false, errorMessage:"The users information could not be retrieved."})
        })
});

server.get('/api/users/:id', (req, res) =>{
    const id = req.params.id;
    console.log(id);
    db.findById(id)
        .then(user => {
            if(user){
                res.status(200).json({success: true, user: user})
            } else {
                res.status(404).json({success: false, errorMessage: "The user with specified id does not exist"})
            }
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({success: false, errorMessage: "The information could not be retrieved"})
        })
});

server.delete('/api/users/:id', (req, res) =>{
    const id = req.params.id;
    db.remove(id)
        .then(user => {
            if(user){
                res.status(204).json({success: true, user: user})
            } else {
                res.status(404).json({success: false, errorMessage: "The user with specified id does not exist"})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({success: false, errorMessage: "The user with specified id does not exist"})
        })
})

server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    if(changes.name === undefined || changes.bio === undefined){
        res.status(400).json({ success: false, errorMessage: "Please provide name and bio for the user." });
    }
    db.update(id, changes)
        .then(updated =>{
            if(updated){
                res.status(200).json({success: true, user: {...changes, id: id}})
            } else {
                res.status(404).json({success: false, errorMessage: "The user with the specified ID does not exist"})
            }
        })
        .catch(err =>{
            res.status(500).json({success: false, errorMessage: 'The user information could not be modified.'})
        })
});
    /*
    200 OK
    The request has succeeded. The meaning of the success depends on the HTTP method:

    GET: The resource has been fetched and is transmitted in the message body.
    HEAD: The entity headers are in the message body.
    PUT or POST: The resource describing the result of the action is transmitted in the message body.
    TRACE: The message body contains the request message as received by the server

    201 Created
    The request has succeeded and a new resource has been created as a result. This is typically the response sent after POST requests, or some PUT requests.
    202 Accepted
    The request has been received but not yet acted upon. It is noncommittal, since there is no way in HTTP to later send an asynchronous response indicating the outcome of the request. It is intended for cases where another process or server handles the request, or for batch processing.
    203 Non-Authoritative Information
    This response code means the returned meta-information is not exactly the same as is available from the origin server, but is collected from a local or a third-party copy. This is mostly used for mirrors or backups of another resource. Except for that specific case, the "200 OK" response is preferred to this status.
    204 No Content
    There is no content to send for this request, but the headers may be useful. The user-agent may update its cached headers for this resource with the new ones.
    205 Reset Content 
*/