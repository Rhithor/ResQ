import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token){
        return res.status(401).json({ message: "Not authorized, no token"});

    }
    try {
        // verifying the token using the JWT secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

        
    } catch(error){
        console.error(error);
        res.status(401).json({ message: "Not authorized, token failed"});
    }
};

export const authorizeVolunteer = (req, res, next) => {
    if (req.user && req.user.role === "volunteer"){
        next();
    } else {
        res.status(403).json({
            message: "Access denied: This area is for volunteers only."
        });
    }
};

