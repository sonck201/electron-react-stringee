import jwt from 'jsonwebtoken';

const apiKeySid = String(process.env.STRINGEE_API_KEY_SID);
const apiKeySecret = String(process.env.STRINGEE_API_KEY_SECRET);

// const token = getAccessToken();
// console.log(token);

export const getAccessToken = (userId: string): string => {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 3600;

  const header = { typ: 'JWT', alg: 'HS256', cty: 'stringee-api;v=1' };
  const payload = {
    jti: `${apiKeySid}-${now}`,
    iss: apiKeySid,
    exp,
    // rest_api: true,
    userId,
  };

  const token = jwt.sign(payload, apiKeySecret, {
    algorithm: 'HS256',
    header,
  });

  return token;
};

export default {};
