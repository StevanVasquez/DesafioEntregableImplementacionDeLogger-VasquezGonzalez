import { PERSISTENCE } from "../config/config.js";
import Connection from "../utils/connect.js";

export let Carts;
export let Products;
export let Sessions;

switch (PERSISTENCE) {
  case "MONGO":
    const mongoInstance = Connection.getInstance();
    const { default: CartServiceDao } = await import(
      "../dao/mongodb/cart.mongo.js"
    );
    const { default: ProductServiceDao } = await import(
      "../dao/mongodb/product.mongo.js"
    );
    const { default: SessionServiceDao } = await import(
      "./mongodb/user.mongo.js"
    );
    Carts = CartServiceDao;
    Products = ProductServiceDao;
    Sessions = SessionServiceDao;
    break;

  case "FS":
    const { default: CartServiceFs } = await import(
      "./fs/cart.fs.js"
    );
    const { default: ProductServiceFs } = await import(
      "./fs/product.fs.js"
    );
    const { default: SessionServiceFs } = await import(
      "./fs/user.fs.js"
    );
    Carts = CartServiceFs;
    Products = ProductServiceFs;
    Sessions = SessionServiceFs;
    break;
}