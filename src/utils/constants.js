export const ALLOW_ORIGIN = !!process.env.PRODUCTION ?
  `https://gragitty.netlify.com` :
  `http://localhost:3000`