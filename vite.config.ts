import { defineConfig, loadEnv, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import type { IncomingMessage, ServerResponse } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// A simple plugin to run Vercel serverless functions locally in Vite
const vercelApiPlugin = () => ({
  name: 'vercel-api-plugin',
  configureServer(server: ViteDevServer) {
    server.middlewares.use(
      async (
        req: IncomingMessage & { body?: any; query?: any },
        res: ServerResponse & {
          status?: (code: number) => any;
          json?: (data: any) => void;
          send?: (data: any) => void;
        },
        next: () => void
      ) => {
        if (req.url?.startsWith('/api/')) {
          try {
            const urlObj = new URL(req.url, `http://${req.headers.host}`);
            let functionName = urlObj.pathname.replace('/api/', '').split('/')[0];
            functionName = functionName.split('?')[0];

            const functionPath = path.resolve(__dirname, `api/${functionName}.js`);

            if (fs.existsSync(functionPath)) {
              const env = loadEnv('', process.cwd(), '');
              Object.assign(process.env, env);

              let body = '';
              req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
              await new Promise(resolve => req.on('end', resolve));

              req.body = body;
              if (req.headers['content-type']?.includes('application/json') && body) {
                try { req.body = JSON.parse(body); } catch (e) { }
              }

              req.query = Object.fromEntries(urlObj.searchParams);

              res.status = (code: number) => {
                res.statusCode = code;
                return res;
              };
              res.json = (data: any) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              };
              res.send = (data: any) => {
                res.end(data);
              };

              const handlerModule = await server.ssrLoadModule(`/api/${functionName}.js`);
              if (handlerModule.default) {
                await handlerModule.default(req, res);
              } else {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: "No default export found" }));
              }
              return;
            }
          } catch (err: any) {
            console.error("Local API Error:", err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message, stack: err.stack }));
            return;
          }
        }
        next();
      }
    );
  }
});

export default defineConfig({
  plugins: [react(), tailwindcss(), vercelApiPlugin()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './src'),
      },
      {
        find: '@fimo/ui',
        replacement: path.resolve(__dirname, './src/lib/fimo-ui.tsx'),
      }
    ],
  },
});