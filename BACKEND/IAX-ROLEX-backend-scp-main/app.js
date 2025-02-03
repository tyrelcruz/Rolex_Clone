require("dotenv").config();
require("express-async-errors");
const path = require("path");

//extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
// const { doubleCsrf } = require("csrf-csrf"); // Cross-Domain Misconfiguration fix

// const cookieParser = require("cookie-parser"); 

const express = require("express");
const app = express();

//connectDB
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");

//routers
const authRouter = require("./routes/auth");
const watchesRouter = require("./routes/watches");
const cartsRouter = require("./routes/carts");

//error-handler
const errorHandlerMiddleWare = require("./middleware/error-handler");
const { log } = require("console");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowsMs: 15 * 60 * 1000, //15minutes
    max: 100, //limit each IP to 100 requests per windowMs
  })
);

app.use(express.json());

// Define allowed origins
const allowedOrigins = ["http://localhost:5500", "http://127.0.0.1:3000"];

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the origin is in the whitelist/allowed
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("The CORS policy for this site does not allow access from this origin."));
      }
    },
    credentials: true,
  })
);

// Use helmet to set security headers
// Proposed fix for CSP: Wildcard Directive and style-src unsafe-inline
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Allow resources from the same origin
        scriptSrc: ["'self'"], // Allow scripts from self
        styleSrc: ["'self'", "https://fonts.googleapis.com", "404style"], // Allow styles from self and Google Fonts
        imgSrc: ["'self'", "data:"], // Allow images from self and data URIs
        fontSrc: ["'self'", "https://fonts.gstatic.com"], // Allow fonts from self and Google Fonts
        connectSrc: ["'self'", "http://127.0.0.1:3000"], // Allow connections to your backend
        frameSrc: ["'none'"], // Disallow embedding in iframes
        objectSrc: ["'none'"], // Disallow embedding objects
      },
    },
  })
);


app.use(xss());

app.use(express.static(path.join(__dirname, "public")));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// setting the X-Frame-Options header to DENY
// fix for 'Missing Anti-clickjacking Header' (230)
app.use(helmet.frameguard({ action: 'deny' }));

// fix implemented for 'Disclosure'-related vulnerabilities.
// such as 'Application Error Disclosure', 'Information Disclosure
// - Debug Error Messages', 'Private IP Disclosure', and 'Timestamp Disclosure'
app.use('/node_modules', (req, res, next) => {
  res.status(403).send('Access Denied.');
});

// fix implemented for 'Hidden File Found' vulnerability
app.use('/.git', (req, res, next) => {
  res.status(403).send('Access denied');
});

// Cross-Domain Misconfiguration fix
// const { doubleCsrfProtection } = doubleCsrf({
//   getSecret: () => 'secret-key-goes-here',
//   cookieName: 'csrf-token',
//   cookieOptions: {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     size: 64,
//   }
// });

// applying CSRF protection to all routes
// app.use(doubleCsrfProtection);

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/watches", watchesRouter);
app.use("/api/v1/carts", authenticateUser, cartsRouter);

// Custom-made 404 page for handling 404 errors.
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

//extra packages

app.use(errorHandlerMiddleWare);

const PORT = process.env.PORT || 3000;

const start = async () => {
  console.log('initial...');
  
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is listening at https://localhost:${PORT}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
