exports.config = {   
    seleniumAddress: 'http://localhost:9515',

    specs: ['T01-gdp-per-capita-LoadResources.js','T02-gdp-per-capita-AddResources.js'],

    capabilities: {
        'browserName': 'phantomjs'
      }
};