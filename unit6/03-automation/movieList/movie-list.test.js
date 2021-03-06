const { Builder, Capabilities, By } = require('selenium-webdriver');

require('chromedriver');

const driver = new Builder().withCapabilities(Capabilities.chrome()).build();

beforeAll(async () => {
    await driver.get('http://localhost:5500/movieList/index.html');
});

afterAll(async () => {
    await driver.quit();
});

test('able to add a movie to the list', async () => {
    await driver.findElement(By.xpath('//input[@placeholder="Add Movie"]')).sendKeys('Billy Madison');
    await driver.findElement(By.xpath('//button[text()="Add"]')).click();
    const movie = await driver.findElement(By.xpath('//span[text()="Billy Madison"]'));
  
    const isDisplayed = await movie.isDisplayed();
    await driver.sleep(1000);
    expect(isDisplayed).toBeTruthy();
});

test('be able to cross off a movie', async () => {
    const movie = await driver.findElement(By.xpath('//span'));
    await movie.click();
    await driver.sleep(1000);
    const movieClasses = await movie.getAttribute('class');
    expect(movieClasses.includes('checked')).toBeTruthy();
});

test('be able to undo movie cross off', async () => {
    const movie = await driver.findElement(By.xpath('//span[@class="checked"]'));
    await movie.click();
    await driver.sleep(1000);
    const movieClasses = await movie.getAttribute('class');
    expect(movieClasses.includes('checked')).toBeFalsy();
});

test('be able to delete a movie', async () => {
    const deleteButton = await driver.findElement(By.xpath('//span[text()="Billy Madison"]/../button'));
    await deleteButton.click();
    const isMoviePresent = await driver.findElements(By.xpath('//span[text()="Billy Madison"]')).length > 0;
    await driver.sleep(1000);
    expect(isMoviePresent).toBeFalsy();
});

// TODO: tests - deleting a movie, the notifications that are displayed