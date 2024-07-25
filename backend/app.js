require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const vocabularys = require('./router/vocabulary');
const admin = require('./router/admin');
const connectDB = require('./database/connect');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const notFound = require('./Middleware/notfound');
const errorHandler = require('./Middleware/error-handler');



app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors());


app.use('/api/v1/vocabularys', vocabularys);
app.use('/api/v1/admin', admin);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI).then(()=> console.log("connected to database"));
        app.listen(port, () => console.log(`Server is listening on port ${port}...`));
    } catch (error) {
        console.log(error);
    }
};

start();