import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser'

dotenv.config();

// app.use(cors());
const app = express();
app.use(express.json());
app.use(cookieParser());    // with that we can get the cookie in req
const PORT = process.env.PORT;

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);



app.listen(PORT, () => {
    console.log(`Server is successfully running on port http://localhost:${PORT}`);
    connectDB();
})