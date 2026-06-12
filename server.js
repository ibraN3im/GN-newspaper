// Root entry point for Render deployment
// Changes working directory to backend before loading server
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Change working directory to backend folder so relative imports resolve correctly
process.chdir(path.join(__dirname, 'Ghalaba-backend'));

// Now load the backend server
await import('./Ghalaba-backend/server.js');
