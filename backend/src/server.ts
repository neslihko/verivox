import autoload, { AutoloadPluginOptions } from '@fastify/autoload';
import cors from '@fastify/cors';
import { FastifyPluginAsync } from 'fastify';
import { join } from 'path';

// Pass --options via CLI arguments in command to enable these options.
export type AppOptions = {} & Partial<AutoloadPluginOptions>;
const options: AppOptions = {};

const pluginsDir = join(__dirname, 'plugins');
const modulesDir = join(__dirname, 'modules');

const server: FastifyPluginAsync<AppOptions> = async (fastify, opts) => {
    fastify.register(cors,{
        origin: 'http://localhost:3000'  // Replace with your frontend origin
       
      });
    fastify.register(autoload, { dir: pluginsDir, options: opts });
    fastify.register(autoload, { dir: modulesDir, options: opts, routeParams: true });
};

export default server;
export { server, options };
