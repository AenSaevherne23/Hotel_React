const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "hotel"
});

app.get("/", (req, res) => {
    if(req.session.username) {
        return res.json({ valid: true, username: req.session.username, userId: req.session.userId });
    } else {
        return res.json({ valid: false });
    }
});

app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;
    const sql = "INSERT INTO login (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, password], (err, data) => {
        if(err) {
            return res.json("ERROR");
        }
        return res.json(data);
    });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, data) => {
        if(err) {
            return res.json("ERROR");
        }
        if(data.length > 0) {
            req.session.userId = data[0].ID;
            req.session.username = data[0].name;
            return res.json({ Login: true, userId: data[0].ID, userType: data[0].type });
        } else {
            return res.json({ Login: false });
        }
    });
});

app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if(err) {
            return res.json({ success: false });
        }
        return res.json({ success: true });
    });
});

app.get("/rooms", (req, res) => {
    const sql = "SELECT * FROM rooms";
    db.query(sql, (err, data) => {
        if(err) {
            return res.json("ERROR");
        }
        return res.json(data);
    });
});

app.get("/rezerwacje", (req, res) => {
    const sql = "SELECT * FROM bookings";
    db.query(sql, (err, data) => {
        if(err) {
            return res.json("ERROR");
        }
        return res.json(data);
    });
});

app.post("/bookings", (req, res) => {
    const { room_id, user_id, check_in_date, check_out_date, total_cost } = req.body;
    const sql = "INSERT INTO bookings (room_id, user_id, check_in_date, check_out_date, cost) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [room_id, user_id, check_in_date, check_out_date, total_cost], (err, data) => {
        if(err) {
            return res.json("ERROR");
        }
        return res.json(data);
    });
});


app.put("/rooms/:id", (req, res) => {
    const { id } = req.params;
    const { availability } = req.body;
    const sql = "UPDATE rooms SET availability = ? WHERE room_id = ?";
    db.query(sql, [availability, id], (err, data) => {
        if(err) {
            return res.json("ERROR");
        }
        return res.json(data);
    });
});

app.post("/create", (req, res) => {
    const sql = "INSERT INTO rooms (`room_number`, `room_type`, `price_per_night`, `availability`) VALUES (?)";
    const values = [
        req.body.room_number,
        req.body.room_type,
        req.body.price_per_night,
        req.body.availability
    ]
    db.query(sql, [values], (err, data) => {
        if(err) return res.json("ERROR");
        return res.json(data);
    })
})

app.delete("/room/:id", (req, res) => {
    const sql = "DELETE FROM rooms WHERE room_id = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, data) => {
        if(err) return res.json("ERROR");
        return res.json(data);
    })
})

app.delete("/rezerwacje/:id", (req, res) => {
    const bookingId = req.params.id;

    const getRoomIdQuery = "SELECT room_id FROM bookings WHERE booking_id = ?";
    db.query(getRoomIdQuery, [bookingId], (err, result) => {
        if (err) {
            console.log(err);
            return res.json("ERROR");
        }

        const roomId = result[0].room_id;

        const deleteBookingQuery = "DELETE FROM bookings WHERE booking_id = ?";
        db.query(deleteBookingQuery, [bookingId], (err, data) => {
            if (err) {
                console.log(err);
                return res.json("ERROR");
            }

            const updateRoomAvailabilityQuery = "UPDATE rooms SET availability = 1 WHERE room_id = ?";
            db.query(updateRoomAvailabilityQuery, [roomId], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.json("ERROR");
                }

                return res.json(data);
            });
        });
    });
});


app.put("/update/:id", (req, res) => {
    const sql = "UPDATE rooms SET `room_number` = ?, `room_type` = ?, `price_per_night` = ?, `availability` = ? WHERE room_id = ?";
    const values = [
        req.body.room_number,
        req.body.room_type,
        req.body.price_per_night,
        req.body.availability
    ]
    const id = req.params.id;

    db.query(sql, [...values, id], (err, data) => {
        if(err) return res.json("ERROR");
        return res.json(data);
    })
})

app.listen(8081, () => {
    console.log("Listening");
});