export default class SessionRepository {
    constructor(dao) {
      this.dao = dao;
    }
  
    findUser = async (email) => {
      try {
        const data = await this.dao.getUserByEmail(email);
        return data;
      } catch (err) {
        return err;
      }
    };
  
    createUser = async (userInfo) => {
      try {
        const data = await this.dao.create(userInfo);
        return data;
      } catch (err) {
        return err;
      }
    };
  }