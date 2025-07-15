import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import chatRouter from './routes/chat.route.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser'
import cors from 'cors';

const app = express();

dotenv.config();
app.use(cors({
  origin: 'http://localhost:5173', // your frontend URL
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());    // with that we can get the cookie in req

const PORT = process.env.PORT;

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);



app.listen(PORT, () => {
    console.log(`Server is successfully running on port http://localhost:${PORT}`);
    connectDB();
})