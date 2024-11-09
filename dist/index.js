import process from 'node:process';
import { remixFastify } from '@mcansh/remix-fastify';
import { fastify } from 'fastify';
import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();
const app = fastify({
    logger: {
        level: process.env.LOG_LEVEL ?? 'info',
        name: process.env.LOG_NAME ?? 'app'
    }
});
await app.register(remixFastify, {
    getLoadContext() {
        return {
            log: app.log.child({ module: 'remix' })
        };
    }
});
const host = process.env.HOST === 'true' ? '0.0.0.0' : '127.0.0.1';
const port = Number(process.env.PORT ?? 3000);
app.listen({ port, host }, (error) => {
    if (error) {
        app.log.error(error);
        process.exit(1);
    }
});
