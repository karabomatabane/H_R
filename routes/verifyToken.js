const jwt = require("jsonwebtoken");

const verifyStudentToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json("You are not authenticated!");
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, student) => {
        if (err) res.status(403).json("Token is not valid!");
        req.student = student;
        next();
    });
}

const verifyStaffToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json("You are not authenticated!");
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, staff) => {
        if (err) res.status(403).json("Token is not valid!");
        req.staff = staff;
        next();
    });
}

const verifyStudentTokenAndAuth = (req, res, next) => {
    verifyStudentToken(req, res, () => {
        if (req.student.id === req.params.id || req.student.roles.includes("admin")) {
            next();
        } else {
            res.status(403).json("You are not allowed to do that");
        }
    });
}

const verifyStudentRole = (req, res, next) => {
    verifyStudentToken(req, res, () => {
        if (req.student.roles.includes("resident")) {
            next();
        } else {
            res.status(403).json("You are not allowed to do that");
        }
    });
}

const verifyStaffTokenAndAuth = (req, res, next) => {
    verifyStaffToken(req, res, () => {
        if (req.staff.id === req.params.id || req.staff.roles.includes("admin")) {
            next();
        } else {
            res.status(403).json("You are not allowed to do that");
        }
    });
}

const verifyStaffTokenAndAdmin = (req, res, next) => {
    verifyStaffToken(req, res, () => {
        if (req.staff.roles.includes("admin")) {
            next();
        } else {
            res.status(403).json("You are not allowed to do that");
        }
    });
}

const verifyStudentTokenAndAdmin = (req, res, next) => {
    verifyStudentToken(req, res, () => {
        if (req.student.roles.includes("admin")) {
            next();
        } else {
            res.status(403).json("You are not allowed to do that");
        }
    });
}
module.exports = {
    verifyStaffToken, verifyStudentToken,
    verifyStaffTokenAndAuth, verifyStudentTokenAndAuth,
    verifyStaffTokenAndAdmin, verifyStudentTokenAndAdmin,
    verifyStudentRole,
};