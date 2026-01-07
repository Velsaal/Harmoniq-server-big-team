export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  if (status === 401) {
    return res.status(401).json({ message: "Authorization required" });
  }

  res.status(status).json({
    status,
    message,
    data: err.message,
  });
};
