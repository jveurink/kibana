import expect from '@kbn/expect';

export default function({ getService, getPageObjects }) {

  describe('creating and deleting default index', function describeIndexTests () {
    const PageObjects = getPageObjects(['common', 'settings']);
    const retry = getService('retry');
    const log = getService('log');
    const browser = getService('browser');

    before(async () => {
      await browser.setWindowSize(1200, 800);
    });

    describe('index pattern creation', function indexPatternCreation () {
      before(async () => {
        await retry.tryForTime(120000, async () => {
          await PageObjects.common.navigateToApp('settings', 'power', 'changeme');
          log.debug('create Index Pattern');
          await PageObjects.settings.createIndexPattern();
        });
      });

      it('should have index pattern in page header', async function pageHeader () {
        const patternName = await PageObjects.settings.getIndexPageHeading();
        expect(patternName).to.be('logstash-*');
      });

      it('should have expected table headers', async function checkingHeader () {
        const headers = await PageObjects.settings.getTableHeader();
        log.debug('header.length = ' + headers.length);
        const expectedHeaders = [
          'Name',
          'Type',
          'Format',
          'Searchable',
          'Aggregatable',
          'Excluded',
          '',
        ];

        expect(headers.length).to.be(expectedHeaders.length);

        await Promise.all(headers.map(async function compareHead (header, i) {
          const text = await header.getVisibleText();
          expect(text).to.be(expectedHeaders[i]);
        }));
      });
    });

    it('create makelogs工程 index pattern', async function pageHeader () {
      log.debug('create makelogs工程 index pattern');
      await PageObjects.settings.createIndexPattern('makelogs工程-');
      const patternName = await PageObjects.settings.getIndexPageHeading();
      expect(patternName).to.be('makelogs工程-*');
    });

  });
}
