// save added page
exports.saveAddedPageData = function(app, fs, headerModel, routerFile) {
    return app.post('/saveAddedPageData', function(req, res) {
        var fileName = req.body['data[fileName]'];
        var parentLink = req.body['data[parentLink]'];
        var linkName = req.body['data[linkName]'];
        var content = req.body['data[content]'];
        var textFile = 'views/pages/' + fileName + '.ejs';
        var fileNameOrLinkNameExistsMessage = fileName + '/' + linkName + ' already exists! Please provide another file/link name.';
        var linkExists = false;
        var checkLink = function(routerArray) {
            routerArray.some(function(v, i, a) {
                if (v.pages) {
                    checkLink(v.pages);
                }
                if (linkName === v.displayText) {
                    //link exists
                    linkExists = true;
                    return true;
                }
            });
        };
        checkLink(headerModel);
        try {
            if (fs.existsSync(textFile) || linkExists) {
                //file exists
                linkExists = false;
                res.send({ statusCode: 403, message: fileNameOrLinkNameExistsMessage });
            } else {
                // create a new file and write to it
                var writeStream = fs.createWriteStream(textFile);
                writeStream.write(content);
                writeStream.end();
                //add menu
                if (parentLink) {
                    headerModel.some(function(v, i, a) {
                        if (parentLink === v.displayText) {
                            v.pages.push({
                                "url": "/" + fileName,
                                "page": fileName,
                                "displayText": linkName,
                                "parentLink": parentLink,
                                "locked": false
                            });
                            return true;
                        }
                    });
                } else {
                    headerModel.push({
                        "url": "/" + fileName,
                        "page": fileName,
                        "displayText": linkName,
                        "parentLink": parentLink,
                        "locked": false
                    });
                }
                fs.writeFile(routerFile, JSON.stringify(headerModel), 'utf8', function(err) {
                    if (err) throw err;
                    var message = fileName + ' saved!'
                    res.send({ statusCode: 200, message: message, routeTo: fileName });
                });
            }
        } catch (err) {
            console.error(err)
        }
    });
}