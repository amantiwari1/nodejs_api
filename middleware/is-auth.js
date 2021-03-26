import jwt from "jsonwebtoken";

export default (req, res, next) => {

    const authHeader = req.get('Authorization');

    console.log(authHeader);

    if (!authHeader) {
        const error = new Error("not authenticated")
        error.statusCode = 401;
        throw error;
    }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "sercet");
  } catch (err) {
    err.statusCode = 401;
    throw err;
  }

  if (!decodedToken) {
      const error = new Error("not authenticated");
      error.statusCode = 401;
      throw error;
  }
  req.userId = decodedToken.userId 
  next();
};
