import {defineConfig} from 'vite';
import path from 'node:path';

export default defineConfig({
    resolve:{
        alias:{
            '@':path.resolve(__dirname,'./src'),
        },
    },
    build:{
        outDir:'dist',
        ssr: true, //server side rendering mode for node.js
        rolldownOptions:{
            external :['express','mongoose','dotenv']
        },
    },
});