/**
 * Tests to check that the nbextensions_configurator page at
 * <base_url>/nbextensions
 * actually loads
 */

casper.open_nbextensions_configurator = function () {
    // Start casper by opening the nbextensions_configurator page.
    var baseUrl = casper.get_notebook_server();
    casper.start(baseUrl + 'nbextensions');
    // Wait for the nbextensions_configurator page to load.
    casper.waitFor(casper.page_loaded);
    return casper.waitForSelector('.nbext-showhide-incompat');
};


casper.test.begin('<base_url>/nbextensions page tests', 1, function (test) {
    // Open the nbextensions_configurator page
    casper.open_nbextensions_configurator();
    // do tests
    casper.then(function () {
        test.assertElementCount('.nbext-showhide-incompat', 1, 'exactly one incompat control exists');
    });
    // do closedown stuff to prevent websocket leakage
    casper.then(function () {
        casper.page.close();
        casper.page = null;
    });
    // Run the browser automation.
    casper.run(function() {
        casper.test.done();
    });
});
