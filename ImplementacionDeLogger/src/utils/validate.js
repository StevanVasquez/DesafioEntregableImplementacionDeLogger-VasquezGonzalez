const validationUtils = {
    validateRegisterBody: (body) => {
      if (
        !body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.age ||
        !body.password ||
        body.password === ""
      ) {
        return false;
      } else {
        return true;
      }
    },
  
    validateLoginBody: (body) => {
      if (!body.email || !body.password) {
        return false;
      } else {
        return true;
      }
    },
  
    validateInput: (input) => {
      const inputRegex = /^[a-zA-Z\s]+$/;
  
      if (!inputRegex.test(input)) {
        return false;
      } else {
        return true;
      }
    },
  
    validateEmail: (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return false;
      } else {
        return true;
      }
    },
  
    limitInputLength: (input) => {
      if (input.length > 20) {
        return true;
      } else {
        return false;
      }
    },
  
    validateAge: (age) => {
      if (age <= 0) {
        return true;
      } else {
        return false;
      }
    },
  
    validatePassword: (password) => {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
  
      if (password.length < 8) {
        return "Password must be at least 8 characters long.";
      }
      if (!passwordRegex.test(password)) {
        return "Password must have at least one lowercase letter, one uppercase letter, one number and one special character (@$!%*?&).";
      }
      return false;
    },
  
    validateProduct: (product) => {
      if (
        !product.title ||
        !product.description ||
        !product.code ||
        !product.price ||
        !product.status ||
        !product.stock ||
        !product.category
      ) {
        return false;
      } else {
        return true;
      }
    },
  
    validateProductBody: (product) => {
      const fields = [
        "title",
        "description",
        "code",
        "price",
        "status",
        "stock",
        "category",
      ];
      const body = Object.keys(product).filter(
        (field) => !fields.includes(field)
      );
      if (body.length > 0) {
        return false;
      } else {
        return true;
      }
    },
  
    validatePrice: (price) => {
      if (price <= 0) {
        return false;
      } else {
        return true;
      }
    },
  
    validateUpdatedCartBody: (updatedCartBody) => {
      if (!updatedCartBody.products) {
        return false;
      } else {
        return true;
      }
    },
  
    validateTicketBody: (ticketBody) => {
      if (
        !ticketBody.purchaser ||
        !ticketBody.purchase_datetime ||
        !ticketBody.amount
      ) {
        return false;
      } else {
        return true;
      }
    },
  };
  
  export default validationUtils;