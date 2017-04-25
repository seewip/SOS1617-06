exports.config = {   
    seleniumAddress: 'http://localhost:9515',

    specs: ['T01-gdp-LoadData.js','T02-gdp-AddData.js'],

    capabilities: {
        'browserName': 'phantomjs'
      }
};