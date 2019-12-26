// save edited page
exports.saveEditedPageData = function(app, fs, headerModel, routerFile) {
    return app.post('/saveEditedPageData', function(req, res) {
        var fileName = req.body['data[fileName]'];
        var linkName = req.body['data[linkName]'];
        var content = req.body['data[content]'];
        var oldFileName = req.body['data[oldFileName]'];
        var oldLinkName = req.body['data[oldLinkName]'];
        var textFile = 'views/pages/' + fileName + '.ejs';
        var oldTextFile = 'views/pages/' + oldFileName + '.ejs';
        var fileNameExistsMessage = fileName + ' already exists! Please provide another file name.';
        var linkNameExistsMessage = linkName + ' already exists! Please provide another link name.';
        var refreshMessage = 'Refreshing page content. Click to continue.';
        var newLinkExists = false;
        var checkNewLinkExistence = function(routerArray) {
            if (linkName !== oldLinkName) {
                for (var i = 0; i < routerArray.length; i++) {
                    if (linkName === routerArray[i].displayText) {
                        newLinkExists = true;
                        break;
                    }
                    if (routerArray[i].pages) {
                        checkNewLinkExistence(routerArray[i].pages);
                    }
                }
            } else {
                newLinkExists = true;
            }
            return newLinkExists;
        };
        if (checkNewLinkExistence(headerModel) && linkName !== oldLinkName) {
            // send new link existence warning
            res.send({ statusCode: 403, message: linkNameExistsMessage });
            return;
        }
        if (textFile !== oldTextFile && fs.existsSync(textFile)) {
            //file exists
            res.send({ statusCode: 403, message: fileNameExistsMessage });
            return;
        } else {
            //writing to old file
            fs.readFile(oldTextFile, 'utf8', function(err, data) {
                if (err) throw err;
                if (data !== content) {
                    fs.writeFile(oldTextFile, content, 'utf8', function(err) {
                        if (err) throw err;
                    });
                } //renaming link
                if (linkName !== oldLinkName) {
                    var renameLink = function(routerArray) {
                        routerArray.some(function(v, i, a) {
                            if (v.pages) {
                                renameLink(v.pages);
                            } else if (oldLinkName === v.displayText) {
                                v.url = "/" + fileName;
                                v.page = fileName;
                                v.displayText = linkName;
                                v.locked = false;
                                return true;
                            }
                        });
                    };
                    renameLink(headerModel);
                    //update menu
                    fs.writeFile(routerFile, JSON.stringify(headerModel), 'utf8', function(err) {
                        if (err) throw err;
                    });
                }
                //renaming existing file
                if (textFile !== oldTextFile) {
                    fs.rename(oldTextFile, textFile, function(err) {
                        if (err) { console.log('ERROR: ' + err); }
                        var updatePageRef = function(routerArray) {
                            routerArray.some(function(v, i, a) {
                                if (v.pages) {
                                    updatePageRef(v.pages);
                                }
                                if (oldFileName === v.page) {
                                    v.url = "/" + fileName;
                                    v.page = fileName;
                                    v.displayText = linkName;
                                    v.locked = false;
                                }
                            });
                        };
                        updatePageRef(headerModel);
                        //update menu ref to page
                        fs.writeFile(routerFile, JSON.stringify(headerModel), 'utf8', function(err) {
                            if (err) throw err;
                        });
                    });
                }
            });
            res.send({ statusCode: 200, message: refreshMessage, routeTo: fileName });
        }
    });
}