import { Router } from "express";
import { getCarts, getCartById, createCart, addProductToCart, updateCartById, deleteCartById, deleteProductFromCart } from "../controllers/cart.controller.js";
import isValidMongoId from "../middlewares/validate-mongoId.js";
import { handlePolicies } from "../middlewares/policies.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.get("/", handlePolicies([ROLES[0]]), getCarts);

router.get("/:cid", isValidMongoId("cid"), getCartById);

router.post("/", createCart);

router.post(
  "/:cid/products/:pid",
  [isValidMongoId("cid"), isValidMongoId("pid"), handlePolicies([ROLES[1]])],
  addProductToCart
);

router.put(
  "/:cid",
  [isValidMongoId("cid"), handlePolicies([ROLES[0]])],
  updateCartById
);

router.delete(
  "/:cid",
  [isValidMongoId("cid"), handlePolicies([ROLES[0]])],
  deleteCartById
);

router.delete(
  "/:cid/products/:pid",
  [isValidMongoId("cid"), isValidMongoId("pid")],
  deleteProductFromCart
);

export default router;