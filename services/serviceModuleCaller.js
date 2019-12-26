exports.loadServices = function(app, fs, jre, java) {

    // setting router variables for utilisation by services
    var routerFile = 'model/headerModel.json';
    var headerModel = require("../" + routerFile);

    /**********************************************/
    /**        SERVICES BLOCK - START            **/
    /**********************************************/

    // READ OPERATIONS - setting up dynamic routes
    require('./serviceModules/service_routerSetup').routerSetup(app, headerModel, headerModel);

    // READ OPERATIONS - fetching page string for editing
    require('./serviceModules/service_fetchDataForEditingCurrentPage').fetchDataForEditingCurrentPage(app, fs);

    // WRITE OPERATIONS - save edited page
    require('./serviceModules/service_saveEditedPageData').saveEditedPageData(app, fs, headerModel, routerFile);

    // WRITE OPERATIONS - save added page
    require('./serviceModules/service_saveAddedPageData').saveAddedPageData(app, fs, headerModel, routerFile);

    // WRITE OPERATIONS - delete current page
    require('./serviceModules/service_deleteCurrentPage').deleteCurrentPage(app, fs, headerModel, routerFile);

    // WRITE OPERATIONS - save new parent link
    require('./serviceModules/service_saveNewParentLink').saveNewParentLink(app, fs, headerModel, routerFile);

    // WRITE OPERATIONS - save edited parent link
    require('./serviceModules/service_saveEditedParentLink').saveEditedParentLink(app, fs, headerModel, routerFile);

    // WRITE OPERATIONS - delete empty parent link
    require('./serviceModules/service_deleteEmptyParentLink').deleteEmptyParentLink(app, fs, headerModel, routerFile);

    // TODO - Do further processing of Excel Workbook sent from UI
    require('./serviceModules/service_sendDataFromExcelEditorToServer').processExcelWorkBook(app, fs, headerModel, routerFile);

    /********** JAVA Services (start) **********/

    var output = jre.spawnSync( // call synchronously
        ['services/java'], // add the relative directory 'java' to the class-path
        'Hello', // call main routine in class 'Hello'
        ['World'], // pass 'World' as only parameter
        { encoding: 'utf8' } // encode output as string
    ).stdout.trim(); // take output from stdout as trimmed String
    console.log('output >>> ', output); // Should print 'Hello, World!'





    // WRITE OPERATIONS - online java compilation
    require('./serviceModules/service_runJavaCode').runJavaCode(app, fs, java);

    // READ OPERATIONS - AirportcountryMap
    require('./serviceModules/service_CountryCodeAirportCode').AirportcountryMap(app, fs, java);




    /********** JAVA Services (end) **********/

    /**********************************************/
    /**        SERVICES BLOCK - END              **/
    /**********************************************/
}