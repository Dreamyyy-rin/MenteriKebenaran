export const env = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/news-portal",
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret_key_here"
};
