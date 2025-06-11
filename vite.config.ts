import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],

server:{
  allowedHosts: [
    
    "cb47-196-188-252-110.ngrok-free.app"
  ],
}
});