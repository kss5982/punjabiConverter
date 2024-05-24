import "dotenv/config";

const PORT = process.env.VITE_PORT;
const MONGODB_URI = process.env.MONGODB_URI;

export default { MONGODB_URI, PORT };
