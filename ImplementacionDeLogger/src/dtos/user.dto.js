export default class UserDTO {
    constructor(user) {
      this.id = user.id;
      this.fullName = `${user.first_name} ${user.last_name}`;
      this.email = user.email;
      this.age = user.age;
      this.role = user.role.toUpperCase();
      this.userCarts = user.carts;
    }
  }