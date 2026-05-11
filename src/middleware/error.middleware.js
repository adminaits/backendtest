export function notFoundHandler(req, res, next) {
  res.status(404).json({
    error: "Route not found"
  });
}

export function errorHandler(error, req, res, next) {
  console.error("Backend error:", error);

  res.status(error.status || 500).json({
    error: error.message || "Internal server error"
  });
}
