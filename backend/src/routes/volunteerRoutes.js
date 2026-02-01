import express from "express";

const router = express.Router();

router.get('/hello', (req, res) => {
    res.json({message:'Volunteers finding nearby victims'});
});


export default router;