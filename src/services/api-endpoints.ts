export const ENDPOINT = {
  //auth
  login: `/authentication/login`,
  logout: `/authentication/logout`,
  refresh: `/authentication/token/refresh`,
  changePassword: `/authentication/password/change`,

  //user
  getUser: `/user?user_id=%s`,
  getUserProfile: `/user/profile/`,
  updateUserProfile: `/user/profile/update/`,

  //wallet
  getWallet: `/wallet?wallet_id=%d`,
};
