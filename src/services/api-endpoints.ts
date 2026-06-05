export const ENDPOINT = {
  //auth
  login: `/authentication/login`,
  logout: `/authentication/logout`,
  refresh: `/authentication/token/refresh`,
  changePassword: `/authentication/password/change`,
  signUp: `/authentication/signup`,

  //user
  getUsers: `/users`,
  getUser: `/user?user_id=%s`,
  createUser: `/user`,
  updateUser: `/user/%s`,
  deleteUser: `/user/%s`,
  getUserProfile: `/user/profile/`,
  updateUserProfile: `/user/profile/`,

  //wallet
  getWallet: `/wallet?wallet_id=%d`,

  //recommend
  recommend: `/food`,
  //transaction
  createTransaction: `/transaction`,
  lazyloadTransactions: `/transactions`,
};
