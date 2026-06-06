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

  //lucky pick
  getLuckyPicks: `/lucky-picks`,
  //recommend
  recommend: `/food`,

  //history
  history: `/foods`,
  getFood: `/food/%s`,

  //transaction
  createTransaction: `/transaction`,
  lazyloadTransactions: `/transactions`,
};
