import express from "express";
import passport from "passport";
import displayRoutes from "express-routemap";
import cookieParser from "cookie-parser";
import { setLogger } from "./utils/logger.js";
import { NODE_ENV, PORT } from "./config/config.js";
import __dirname from "./utils.js";
import initializePassport from "./config/passport.config.js";
import cartRoutes from "./routes/cart.routes.js";
import productRoutes from "./routes/product.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import testRoutes from "./routes/test.routes.js";

const app = express();
const PORT_APP = PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(setLogger);
initializePassport();
app.use(passport.initialize());

app.use("/api/carts", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/loggerTest", testRoutes);

app.listen(PORT_APP, () => {
  displayRoutes(app);
  console.log(`Running on ${PORT_APP}, environment: ${NODE_ENV}`);
});