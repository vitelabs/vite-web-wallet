import { getAssetFromKV, mapRequestToAsset, serveSinglePageApp } from '@cloudflare/kv-asset-handler';
import { handleSeoBotRequest, isBotForPrerender } from './seo.js';

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */
const DEBUG = false;
const browserCacheList = [ '.js', '.css', '.otf', '.ttf', '.ttc' ];

addEventListener('fetch', event => {
    try {
        if (isBotForPrerender(event.request)) {
            return event.respondWith(handleSeoBotRequest(event.request));
        }
        event.respondWith(handleEvent(event));
    } catch (e) {
        if (DEBUG) {
            return event.respondWith(new Response(e.message || e.toString(), { status: 500 }),);
        }
        event.respondWith(new Response('Internal Error', { status: 500 }));
    }
});

function mapRequestCacheControl(request) {
    const url = new URL(request.url);
    if (browserCacheList.some(item => url.pathname.endsWith(item))) {
        return { browserTTL: 60 * 60 * 24 * 365, edgeTTL: 2 * 60 * 60 * 24 };
    }
    return { edgeTTL: 2 * 60 * 60 * 24 };
}

async function handleEvent(event) {
    const url = new URL(event.request.url);
    const options = {
        mapRequestToAsset: serveSinglePageApp,
        cacheControl: mapRequestCacheControl
    };

    /**
   * You can add custom logic to how we fetch your assets
   * by configuring the function `mapRequestToAsset`
   */
    // options.mapRequestToAsset = handlePrefix(/^\/docs/)

    if (url.pathname.startsWith('/mobiledex')) {
        // Redirect /mobiledex to /mobiledex/
        if (url.pathname === '/mobiledex') {
            url.pathname = '/mobiledex/';
            return Response.redirect(url.toString(), 301);
        }
        options.mapRequestToAsset = request => new Request(`${ url.origin }/mobiledex/mobileDex.html`, request);
    }

    try {
        if (DEBUG) {
            // customize caching
            options.cacheControl = { bypassCache: true };
        }
        return await getAssetFromKV(event, options);
    } catch (e) {
    // if an error is thrown try to serve the asset at 404.html
        if (!DEBUG) {
            try {
                const notFoundResponse = await getAssetFromKV(event, { mapRequestToAsset: req => new Request(`${ new URL(req.url).origin }/404.html`, req) });

                return new Response(notFoundResponse.body, { ...notFoundResponse, status: 404 });
            } catch (e) {}
        }

        return new Response(e.message || e.toString(), { status: 500 });
    }
}

/**
 * Here's one example of how to modify a request to
 * remove a specific prefix, in this case `/docs` from
 * the url. This can be useful if you are deploying to a
 * route on a zone, or if you only want your static content
 * to exist at a specific path.
 */
function handlePrefix(prefix) {
    return request => {
    // compute the default (e.g. / -> index.html)
        const defaultAssetKey = mapRequestToAsset(request);
        const url = new URL(defaultAssetKey.url);

        // strip the prefix from the path for lookup
        url.pathname = url.pathname.replace(prefix, '/');

        // inherit all other props from the default request
        return new Request(url.toString(), defaultAssetKey);
    };
}
