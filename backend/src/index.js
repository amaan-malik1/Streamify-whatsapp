import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import chatRouter from './routes/chat.route.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser'
import cors from 'cors';
import path from 'path'

const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());    // with that we can get the cookie in req

const PORT = process.env.PORT;
const __dirname = path.resolve();


app.use(cors({
  origin: 'http://localhost:5173', // your frontend URL
  credentials: true,
}));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../streamify/dist")));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../streamify", "dist", "index.html"))
  })

}


app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);



app.listen(PORT, () => {
  console.log(`Server is successfully running on port http://localhost:${PORT}`);
  connectDB();
})