import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js'; 
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT || 4000;
connectDB();

const allowedOrigins = ['http://localhost:5173']

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/EmployeeDB"; 
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins,credentials: true}));

app.get('/', (req, res) => {res.send('hello API');});
app.use('/api/auth', authRouter);
app.use('/api/user',userRouter);
app.listen(port, () => {    
    console.log(`Server is running on port: ${port}`);
});