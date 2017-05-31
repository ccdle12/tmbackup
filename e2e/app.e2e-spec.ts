import { TMFDMMWebAppPage } from './app.po';

describe('tmfdmmweb-app App', () => {
  let page: TMFDMMWebAppPage;

  beforeEach(() => {
    page = new TMFDMMWebAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
