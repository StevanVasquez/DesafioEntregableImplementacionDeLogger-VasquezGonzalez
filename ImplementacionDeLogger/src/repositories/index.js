import { Carts, Products, Sessions } from "../dao/factory.js";
import CartRepository from "./cart.repository.js";
import ProductRepository from "./product.repository.js";
import SessionRepository from "./user.repository.js";

export const CartService = new CartRepository(new Carts());
export const ProductService = new ProductRepository(new Products());
export const SessionService = new SessionRepository(new Sessions());