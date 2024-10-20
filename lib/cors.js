import Cors from 'cors';

// Initialize CORS middleware
const cors = Cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    origin: '*', // Consider specifying your allowed origins for security
    credentials: true, // Include credentials (if needed)
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
});

// Helper method to wait for a middleware to execute before continuing
export const runCors = (req, res) => {
    return new Promise((resolve, reject) => {
        cors(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
};
