// For more information, see https://crawlee.dev/
import { Dataset, PlaywrightCrawler, ProxyConfiguration } from 'crawlee';
import { BrowserName, DeviceCategory, OperatingSystemsName } from '@crawlee/browser-pool';
import { launchOptions } from 'camoufox-js';
import { firefox } from 'playwright';

const crawler = new PlaywrightCrawler({
    postNavigationHooks: [
        async ({ handleCloudflareChallenge }) => {
            await handleCloudflareChallenge();
        },
    ],
    launchContext: {
        launcher: firefox,
        launchOptions: await launchOptions({
            headless: true,
        }),
    },
    async requestHandler({ page, request, log }) {
        const jsonText = await page.textContent('body');
        log.info(jsonText || '');
    },
    async failedRequestHandler({ request }) {
        // This function is called when the crawling of a request failed too many times
        // await Dataset.pushData({
        //     url: request.url,
        //     succeeded: false,
        //     errors: request.errorMessages,
        // })
    },
});

await crawler.run([
    'https://www.flightradar24.com/v1/search/web/find?query=DHK1130&limit=50'
]);

await crawler.run();
