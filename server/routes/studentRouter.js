import express from 'express'
import { getListOfAllStudents } from '../controller/studentController.js';

const route = express.Router();

route.get("/list", getListOfAllStudents);

export default route;
