import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const isProd = mode === 'production';

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        // Proxy API requests to avoid CORS
        '/api': {
          target: 'https://api.arbi.creai.dev',
          changeOrigin: true,
          secure: true,
        },
        '/product': {
          target: 'https://api.arbi.creai.dev',
          changeOrigin: true,
          secure: true,
        }
      }
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.')
      }
    },
    build: {
      // Build optimization settings
      target: 'es2020',
      minify: isProd ? 'terser' : false,
      sourcemap: isProd ? false : true,
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunking for better caching
            'react-vendor': ['react', 'react-dom'],
            'query-vendor': ['@tanstack/react-query'],
            'chart-vendor': ['recharts'],
            'ui-vendor': ['lucide-react', 'react-hot-toast'],
          },
        },
      },
      // Chunk size warnings
      chunkSizeWarningLimit: 1000,
      // CSS code splitting
      cssCodeSplit: true,
      // Optimize dependencies
      reportCompressedSize: isProd,
      // Terser options for production
      terserOptions: isProd ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      } : undefined,
    },
    // Optimize deps
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@tanstack/react-query',
        'zustand',
        'lucide-react',
        'recharts',
      ],
    },
    // Preview server config
    preview: {
      port: 4173,
      host: '0.0.0.0',
    },
  };
});
