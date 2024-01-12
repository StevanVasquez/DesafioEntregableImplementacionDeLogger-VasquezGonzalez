import CartDTO from "../dtos/cart.dto.js";
import { CartService, ProductService } from "../repositories/index.js";
import validationUtils from "../utils/validate.js";
export const getCarts = async (req, res) => {
  try {
    const carts = await CartService.getCarts();
    return res.status(200).json({ message: "Carts: ", carts });
  } catch (err) {
    req.logger.error(err);
    return res
      .status(500)
      .json({ message: "There was an error getting carts." });
  }
};
export const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartService.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Error: Cart not found." });
    } else {
      return res.status(200).json({ message: "Carts: ", cart });
    }
  } catch (err) {
    req.logger.error(err);
    return res
      .status(500)
      .json({ message: "There was an getting a cart by id." });
  }
};
export const createCart = async (req, res) => {
  try {
    const newCart = new CartDTO();
    const cart = await CartService.createCart(newCart);
    return res.status(200).json({ message: "Created cart: ", cart });
  } catch (err) {
    req.logger.error(err);
    return res
      .status(500)
      .json({ message: "There was an error creating a cart." });
  }
};
export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const product = await ProductService.getProductById(pid);

    if (!product) {
      return res.status(404).json({ message: "Error: Product not found." });
    } else {
      const cart = await CartService.getCartById(cid);

      if (!cart) {
        return res.status(404).json({ message: "Error: Cart not found." });
      } else {
        const productInCart = cart.products.find(
          (product) => String(product.product._id) === String(pid)
        );
        if (productInCart) {
          productInCart.quantity++;
          await cart.save();
          return res.status(200).json({ message: "Product already in cart." });
        } else {
          const updatedCart = await CartService.addProductToCart(cid, pid);
          return res
            .status(200)
            .json({ message: "Product added to cart: ", updatedCart });
        }
      }
    }
  } catch (err) {
    req.logger.error(err);
    return res
      .status(500)
      .json({ message: "There was an error adding a product to your cart." });
  }
};
export const updateCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const updatedCartBody = req.body;

    const cart = await CartService.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Error: Cart not found." });
    } else {
      if (!validationUtils.validateUpdatedCartBody(updatedCartBody)) {
        return res
          .status(400)
          .json({ message: "The updated cart body must contain products." });
      }
      const updatedCart = await CartService.updateCartById(
        cid,
        updatedCartBody
      );

      return res.status(200).json({ message: "Updated cart: ", updatedCart });
    }
  } catch (err) {
    req.logger.error(err);
    return res
      .status(500)
      .json({ message: "There was an error updating the cart." });
  }
};
export const deleteCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartService.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Error: Cart not found." });
    } else {
      const deletedCart = await CartService.deleteCartById(cid);
      return res
        .status(200)
        .json({ message: "Cart successfully deleted.", deletedCart });
    }
  } catch (err) {
    req.logger.error(err);
    return res
      .status(500)
      .json({ message: "There was an error deleting the cart." });
  }
};
export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await CartService.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Error: Cart not found." });
    } else {
      const productIndex = cart.products.findIndex(
        (product) => String(product.product._id) === String(pid)
      );
      if (productIndex === -1) {
        return res
          .status(404)
          .json({ message: "Error: Product does not exist in cart." });
      } else {
        const productInCart = cart.products.find(
          (product) => String(product.product._id) === String(pid)
        );
        if (productInCart && productInCart.quantity > 1) {
          productInCart.quantity--;
          await cart.save();
          return res.status(200).json({ message: "Product already in cart." });
        } else {
          cart.products.splice(productIndex, 1);
          const updatedCart = await cart.save();
          return res
            .status(200)
            .json({ message: "Product deleted from cart. ", updatedCart });
        }
      }
    }
  } catch (err) {
    req.logger.error(err);
    return res
      .status(500)
      .json({ message: "There was an error deleting a product from cart." });
  }
};