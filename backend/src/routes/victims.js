import express from "express";

const router = express.Router();
//Get - get information from the backend, post - store information in the backend, put- update information in the backend, delete= delete


router.post('/', (req, res) => {
    res.json({ httpMethod: "post for victims to post SOS signals"});
});


export default router;