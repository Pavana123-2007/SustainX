import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// A simple plugin to run Vercel serverless functions locally in Vite
const vercelApiPlugin = () => ({
  name: 'vercel-api-plugin',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url?.startsWith('/api/')) {
        try {
          const urlObj = new URL(req.url, `http://${req.headers.host}`);
          let functionName = urlObj.pathname.replace('/api/', '').split('/')[0];
          // Remove query params if any
          functionName = functionName.split('?')[0];
          
          const functionPath = path.resolve(__dirname, `api/${functionName}.js`);
          
          if (fs.existsSync(functionPath)) {
            // Load environment variables for local dev
            const env = loadEnv('', process.cwd(), '');
            Object.assign(process.env, env);

            // Mock Vercel req/res
            
            // 1. parse body
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            await new Promise(resolve => req.on('end', resolve));
            
            req.body = body;
            if (req.headers['content-type']?.includes('application/json') && body) {
              try { req.body = JSON.parse(body); } catch (e) {}
            }
            
            // 2. parse query
            req.query = Object.fromEntries(urlObj.searchParams);
            
            // 3. res.status, res.json
            res.status = (code) => {
              res.statusCode = code;
              return res;
            };
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            };
            res.send = (data) => {
              res.end(data);
            };
            
            // Important: clear require cache or use dynamic import with timestamp for hot reloading
            const handlerModule = await server.ssrLoadModule(`/api/${functionName}.js`);
            if (handlerModule.default) {
              await handlerModule.default(req, res);
            } else {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: "No default export found" }));
            }
            return;
          }
        } catch (err) {
          console.error("Local API Error:", err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message, stack: err.stack }));
          return;
        }
      }
      next();
    });
  }
});

export default defineConfig({
  plugins: [react(), tailwindcss(), vercelApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@fimo/ui': path.resolve(__dirname, './src/lib/fimo-ui.tsx'),
    },
  },
});
