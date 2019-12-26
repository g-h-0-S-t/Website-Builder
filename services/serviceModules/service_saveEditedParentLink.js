// save edited parent link
exports.saveEditedParentLink = function(app, fs, headerModel, routerFile) {
    return app.post('/saveEditedParentLink', function(req, res) {
        var newParentLink = req.body['data[newParentLink]'];
        var oldParentLink = req.body['data[oldParentLink]'];
        var fileName = req.body['data[fileName]'];
        var errorMessage = 'Parent Link ' + newParentLink + ' already exists. Please provide a different name.';
        var successMessage = 'Parent Link ' + oldParentLink + ' successfully updated to ' + newParentLink;
        var newParentLinkExists = false;
        var checkParentLinkExistence = function(routerArray) {
            routerArray.some(function(v, i, a) {
                if (newParentLink === v.displayText) {
                    res.send({ statusCode: 403, message: errorMessage });
                    newParentLinkExists = true;
                    return true;
                }
                if (v.pages) {
                    checkParentLinkExistence(v.pages);
                }
            });
        };
        checkParentLinkExistence(headerModel);
        if (!newParentLinkExists) {
            //renaming link
            var renameParentLink = function(routerArray) {
                routerArray.some(function(v, i, a) {
                    if (oldParentLink === v.displayText) {
                        v.displayText = newParentLink;
                        if (v.pages) {
                            v.pages.some(function(val, indx, arr) {
                                val.parentLink = newParentLink;
                            });
                        }
                    }
                });
            };
            renameParentLink(headerModel);
            try {
                fs.writeFile(routerFile, JSON.stringify(headerModel), 'utf8', function(err) {
                    if (err) throw err;
                });
                res.send({ statusCode: 200, message: successMessage, routeTo: fileName });
            } catch (err) {
                console.error(err)
            }
        }
    });
}