const prisma = require("./prisma/prismaClient");

const AuthController = require("./controllers/AuthController");

const express = require("express")
const cors = require('cors');
const app =  express();
app.use(express.json());

app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.urlencoded({ extended: true}));

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const perfilRoutes = require("./routes/perfilRoutes");
app.use("/perfil", AuthController.verificaAutenticacao, perfilRoutes);

const mesaRoutes = require("./routes/mesaRoutes");
app.use("/mesa", mesaRoutes);

const reservaRoutes = require("./routes/reservaRoutes");
app.use("/reservas", AuthController.verificaAutenticacao, reservaRoutes);

app.listen(8000);