const express = require('express');
const next = require('next');
const Cache = require('lru-cache');
const compression = require('compression');

const isProduction = process.env.NODE_ENV === 'production';
const app = next({ dev: !isProduction });

const ssrCache = new Cache({
  max: 20,
  ttl: 1000 * 60 * 60, // 1 hour
});

const renderAndCache =
  (app) => async (request, response, pagePath, queryParams) => {
    const { host } = request.headers;
    // Define the cache key as you wish here:
    const key = host + request.url;

    // If page is in cache, serve from cache
    if (ssrCache.has(key)) {
      response.setHeader('x-cache', 'HIT');
      const html = ssrCache.get(key);
      response.send(html);
      console.info('SSR rendered from cache for key', key);
      return;
    }

    try {
      // Override `res.end` method before sending it to `app.renderToHTML`
      // to be able to get the payload (renderedHTML) and save it to cache
      const responseEnd = response.end.bind(response);

      response.end = (payload) => {
        // Add here custom logic for when you do not want to cache the page,
        // for example when the status is not 200
        if (response.statusCode !== 200) {
          console.warn(
            'SSR skipped cache since statusCode is',
            response.statusCode
          );
        } else {
          ssrCache.set(key, payload);
        }
        return responseEnd(payload);
      };

      // If not in cache, render the page into HTML
      response.setHeader('x-cache', 'MISS');
      const html = await app.renderToHTML(
        request,
        response,
        pagePath,
        queryParams
      );
      response.send(html);
      console.info('SSR rendered without cache for key', key);
    } catch (error) {
      app.renderError(error, request, response, pagePath, queryParams);
    }
  };

(async () => {
  await app.prepare();
  const server = express();
  const handleRequest = app.getRequestHandler();
  const renderAndCacheApp = renderAndCache(app);

  server.get('/', (request, response) => {
    // Since we don't use Next's `requestHandler`,
    // we lose compression, so we manually add it
    server.use(compression());
    renderAndCacheApp(request, response, '/');
  });

  server.get('*', handleRequest);

  const PORT = parseInt(process.env.PORT, 10) || 3000;

  server.listen(PORT, (error) => {
    if (error) {
      throw error;
    }
    console.log(`> Ready on http://localhost:${PORT}`);
  });
})();
