const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const server = http.createServer(app);
const routes = require('./src/routes');

server.listen(process.env.PORT || 4000);                                  

console.log("Server Listening on Port ", process.env.PORT || 4000);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const customHook = (req, res, next) => {
    console.log("Incoming Request Body \n", req.body);
    next();
}

app.use(customHook);
app.use('/api/v1', routes);
app.get('/favicon.ico', (req, res) => res.status(204));

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status = error.status || 500;
    res.json({
        error: {
            message: error.message
        }
    })
    next(error);
});

