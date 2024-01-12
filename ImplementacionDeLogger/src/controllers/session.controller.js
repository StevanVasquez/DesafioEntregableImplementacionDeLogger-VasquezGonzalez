import { createHashValue, isValidPwd } from "../utils/encrypt.js";
import { generateJwt } from "../utils/jwt.js";
import { CartService, ProductService, SessionService } from "../repositories/index.js";
import UserDTO from "../dtos/user.dto.js";
import AuthDTO from "../dtos/auth.dto.js";
import AdminDTO from "../dtos/admin.dto.js";
import validationUtils from "../utils/validate.js";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../config/config.js";
import ProductDTO from "../dtos/product.dto.js";
import CartDTO from "../dtos/cart.dto.js";
export const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!validationUtils.validateRegisterBody(req.body)) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields." });
    }

    const checkUser = await SessionService.findUser(email);

    if (checkUser) {
      return res.status(400).json({ message: "User already exists!" });
    } else {
      if (!validationUtils.validateInput(first_name)) {
        return res.status(400).json({
          message: `${first_name} is not a valid name, it must contain only letters.`,
        });
      }
      if (!validationUtils.validateInput(last_name)) {
        return res.status(400).json({
          message: `${last_name} is not a valid name, it must contain only letters.`,
        });
      }

      if (!validationUtils.validateEmail(email)) {
        return res
          .status(400)
          .json({ message: "Please enter a valid email address." });
      }

      if (validationUtils.limitInputLength(first_name)) {
        return res.status(400).json({
          message: "Invalid first name. Máx. characters allowed: 20.",
        });
      }
      if (validationUtils.limitInputLength(last_name)) {
        return res
          .status(400)
          .json({ message: "Invalid last name. Máx. characters allowed: 20." });
      }

      if (validationUtils.validateAge(age)) {
        return res.status(400).json({ message: "Please enter a valid age." });
      }

      if (validationUtils.validatePassword(password)) {
        return res
          .status(400)
          .json({ message: validationUtils.validatePassword(password) });
      }

      const pwdHashed = createHashValue(password);

      const userInfo = {
        first_name,
        last_name,
        email,
        age,
        password: pwdHashed,
      };
      const newUser = await SessionService.createUser(userInfo);
      const userDTO = new UserDTO(newUser);
      return res.status(201)
      .json({message: "User succcesfully registered: ", userDTO});
      // .redirect("/login");
    }
  } catch (err) {
    req.logger.error(err);
    res.status(500).json({ message: "There was an error registering user." });
  }
};
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = {
      first_name: "Admin CODER",
      age: "-",
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
    };

    if (!validationUtils.validateLoginBody(req.body)) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields." });
    }

    if (req.body.email !== admin.email) {
      const findUser = await SessionService.findUser(email);

      if (!findUser) {
        return res.status(401).json({
          message: "User does not exist, please create an account.",
        });
      }

      const isValidComparePwd = isValidPwd(password, findUser.password);

      if (!isValidComparePwd) {
        return res.status(401)
        // .redirect("/login");
        .json({message: "Invalid password."});
      }

      if (findUser.carts.length === 0) {
        try {
          const newCart = new CartDTO();
          const cart = await CartService.createCart(newCart);
          const createdCart = await CartService.getCartById(String(cart._id));

          findUser.carts.push(createdCart);

          await findUser.save();

          const signUser = {
            first_name: findUser.first_name,
            last_name: findUser.last_name,
            email,
            age: findUser.age,
            role: findUser.role,
            id: String(findUser._id),
            carts: createdCart,
          };

          const token = await generateJwt({ ...signUser });
          req.user = { ...signUser };
          const user = new UserDTO(req.user);

          const docs = await ProductService.getProducts();
          const productsRender = docs.map((product) => new ProductDTO(product));

          res
            .status(200)
            .cookie("Cookie", token, { maxAge: 60 * 60 * 1000, httpOnly: true })
            .json({message: "User succcesfully logged in, welcome "});
        } catch (err) {
          req.logger.error(err);
          return res
            .status(500)
            .json({ message: "There was an error creating a cart." });
        }
      } else {
        const userCart = findUser.carts.map((cart) => {
          return String(cart._id);
        });

        const cart = await CartService.getCartById(String(userCart[0]));

        const signUser = {
          first_name: findUser.first_name,
          last_name: findUser.last_name,
          email,
          age: findUser.age,
          role: findUser.role,
          id: String(findUser._id),
          carts: cart,
        };
        const token = await generateJwt({ ...signUser });
        req.user = { ...signUser };
        const user = new UserDTO(req.user);
        let productsInCart = [];

        if (user.userCarts.products.length > 0) {
          const updatedProductsInCart = user.userCarts.products.map(
            (product) =>
              new ProductDTO(product.product, user.userCarts._id.toHexString())
          );

          productsInCart = updatedProductsInCart;
        }

        const docs = await ProductService.getProducts();
        const productsRender = docs.map(
          (product) => new ProductDTO(product, user.userCarts._id.toHexString())
        );

        res
          .status(200)
          .cookie("Cookie", token, { maxAge: 60 * 60 * 1000, httpOnly: true })
          .json({message: `User succcesfully logged in, welcome ${email}`});
      }
    } else {
      const adminDTO = new AdminDTO(admin.first_name, admin.email, admin.role);
      const token = await generateJwt({ ...adminDTO });

      const docs = await ProductService.getProducts();
        const productsRender = docs.map(
          (product) => new ProductDTO(product)
        );

      res
        .status(200)
        .cookie("Cookie", token, { maxAge: 60 * 60 * 1000, httpOnly: true })
        .json({message: `Admin succcesfully logged in, welcome ${email}`});
    }
  } catch (err) {
    req.logger.error(err);
    return res.status(500).json({ message: "There was an error logging in." });
  }
};
export const userLogout = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "No user session found." });
    } else {
      res.clearCookie("Cookie");
      return res.status(200)
    }
  } catch (err) {
    req.logger.error(err);
    return res.status(500).json({ message: "There was an error logging out." });
  }
};
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "No user session found." });
    } else {
      const authDTO = new AuthDTO(req.user);
      return res.status(200).json({ message: "Current user: ", authDTO });
    }
  } catch (err) {
    req.logger.error(err);
    return res
      .status(500)
      .json({ message: "There was an error getting current user." });
  }
};