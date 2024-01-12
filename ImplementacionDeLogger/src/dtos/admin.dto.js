export default class AdminDTO {
    constructor(first_name, email, role) {
      this.fullName = first_name;
      this.email = email;
      this.role = role.toUpperCase();
    }
  }