require('./db/dbConnection');
const empRoute = require('./routes/empRoute');
const reviewRoute = require('./routes/reviewRoute');
const express = require('express');
const app = express();
//import cors to enable cross origin requests
const cors = require('cors')

app.use(cors());
app.use(express.json());
app.use('/v1/employees/',empRoute);
app.use('/v1/reviews/',reviewRoute);

app.listen('8000');