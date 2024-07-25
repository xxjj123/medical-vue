export const getBaseURL = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  let baseURL;

  if (isProduction) {
    // 生产环境使用location.origin加上VITE_LOGIN_SYS_BASE_SORT的环境变量
    // baseURL = `${location.origin}${process.env.VITE_LOGIN_SYS_BASE_SORT}`;
    baseURL = `${process.env.VITE_LOGIN_SYS_BASE_SORT}`;
  } else {
    // 非生产环境使用location.origin
    baseURL = location.origin;
  }



  return baseURL;
}
