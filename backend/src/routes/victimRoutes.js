import express from "express";

const router = express.Router();

router.post('/', (req, res) => {
    res.json({ httpMethod: "post for victims to post SOS signals"});
});


export default router;