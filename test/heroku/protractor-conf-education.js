exports.config = {   
    seleniumAddress: 'http://localhost:9515',

    specs: ['T01-education-LoadData.js','T02-education-AddData.js'],

    capabilities: {
        'browserName': 'phantomjs'
      }
};