import bcrypt from "bcrypt";
import express from "express";
import {Pool} from "pg";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();



const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const db = new Pool({
    connectionString:process.env.DATABASE_URL,
    ssl:{rejectUnauthorized:false}
});


// ================= ROUTES =================

// Public pages
app.get("/", (req, res) => res.sendFile("login.html", { root: "public" }));
app.get("/login", (req, res) => res.sendFile("login.html", { root: "public" }));
app.get("/register", (req, res) => res.sendFile("register.html", { root: "public"}));



app.post("/register", async (req, res) => {
    const { Email, Password, ConfirmPassword, KEY } = req.body;

    try {

        if (!Email || !Password || !ConfirmPassword || !KEY) {
            return res.status(400).json({
                message: "All fields are required",
                color: "red"
            });
        }

        const checkUser = await db.query(
            "SELECT email FROM user_info WHERE email=$1",
            [Email]
        )

        if(checkUser.rows.length > 0){
            return res.status(400).json({ message: "The user is already exist "})
        }

        if(Password !== ConfirmPassword){
            return res.status(400).json({ message: "Passwords should match", color: "red" })
        }


        const check_KEY = process.env.REGISTER_KEY
        if(KEY !== check_KEY ){
            return res.status(401).json({ message: "Invalid key", color: "red" })
        }

        const hashed = await bcrypt.hash(Password,10)
        await db.query("INSERT INTO user_info(email,password) VALUES($1,$2)",
            [Email,hashed]
        )

        res.json({ message: "Registered successfully", color: "green" });

    } catch (e) {
        res.status(500).json({ message: "Registration error", color: "red" });
    }
});


app.post("/login", async (req, res) => {
    const { loginEmail, loginPassword } = req.body;
    
    try {
        const result = await db.query(
            "SELECT email, password FROM user_info WHERE email=$1",
            [loginEmail]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "User not found", color: "red" });
        }

        const user = result.rows[0];
        const valid = await bcrypt.compare(loginPassword, user.password);

        if (!valid) {
            return res.status(401).json({ message: "Invalid credentials", color: "red" });
        }

        const token = jwt.sign(
            { user: user.email },
            process.env.ACCESS_KEY,
            { expiresIn: "2h" }
        );

        res.cookie("token",token ,{
            httpOnly:true,
            secure:true,
            sameSite:"strict",

        })

        res.json({ success: true });

    } catch (e) {
        res.status(500).json({ message: "Login error", color: "red" });
    }
});

function auth(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/login");
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_KEY);
        req.user = decoded;
        next();
    } catch (e) {
        return res.redirect("/login");
    }
}

app.get("/soccer", auth, (req, res) => {
    res.sendFile("games.html",{root: "public"})
});
app.get("/nfl", auth, (req, res) => {
    res.send("Only soccer is available, NFL predictions will be available soon ")
});
app.get("/basketball", auth, (req, res) => {
    res.send("Only soccer is available, BASKETBALL predictions will be available soon ")
});
app.get("/volleyball", auth, (req, res) => {
    res.send("Only soccer is available, VOLLEYBALL predictions will be available soon ")
});
app.get("/hockey", auth, (req, res) => {
    res.send("Only soccer is available, HOCKEY predictions will be available soon ")
});

app.get("/api/data", async (req, res) => {
  
    try {
        const mondayData = await db.query(`
        SELECT teams.*, monday.*
        FROM teams
        JOIN monday ON monday.team = teams.team_name
        `);
        const monday = mondayData.rows;

        const tuesdayData = await db.query(`
        SELECT teams.*, tuesday.*
        FROM teams
        JOIN tuesday ON tuesday.team = teams.team_name
        `);
        const tuesday = tuesdayData.rows;

        const wednesdayData = await db.query(`
        SELECT teams.*, wednesday.*
        FROM teams
        JOIN wednesday ON wednesday.team = teams.team_name
        `);
        const wednesday = wednesdayData.rows;

        const thursdayData = await db.query(`
        SELECT teams.*, thursday.*
        FROM teams
        JOIN thursday ON thursday.team = teams.team_name
        `);
        const thursday = thursdayData.rows;

        const fridayData = await db.query(`
        SELECT teams.*, friday.*
        FROM teams
        JOIN friday ON friday.team = teams.team_name
        `);
        const friday = fridayData.rows;

        const saturdayData = await db.query(`
        SELECT teams.*, saturday.*
        FROM teams
        JOIN saturday ON saturday.team = teams.team_name
        `);
        const saturday = saturdayData.rows;

        const sundayData = await db.query(`
        SELECT teams.*, sunday.*
        FROM teams
        JOIN sunday ON sunday.team = teams.team_name
        `);
        const sunday = sundayData.rows;
            
        return res.json([sunday,monday,tuesday,wednesday,thursday,friday,saturday]);

    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, error: "Server error" });
    }

});


app.get("/logout",(req,res)=>{
    res.clearCookie("token")
    return res.redirect("/login");
})


const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Server running `);
});


