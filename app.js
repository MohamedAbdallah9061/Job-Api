require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

const connectDB=require('./db/connect');
const authRouter=require('./routes/auth');
const jobsRouter=require('./routes/jobs');
const helmet=require('helmet');
const cors=require('cors');
const xss=require('xss-clean');
const ratelimiter=require('express-rate-limit');
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authMiddlware=require('./middleware/authentication');
app.set('trust proxy',1);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(ratelimiter({
  
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
}));
// extra packages

// routes
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/jobs',authMiddlware,jobsRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
      await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
