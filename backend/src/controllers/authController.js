import express from "express";

const register = async(req, res) => {
    res.json({message: "Register user"});
}

export {register};