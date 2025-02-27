//delete empty parent link
exports.saveNewParentLink = function(app, fs, headerModel, routerFile) {
    return app.post('/saveNewParentLink', function(req, res) {
        var newParentLink = req.body['data[newParentLink]'];
        var errorMessage = 'Parent Link ' + newParentLink + ' already exists. Please provide a different name.';
        var successMessage = 'Parent Link ' + newParentLink + ' successfully added!';
        var parentLinkExists = false;
        var checkParentLinkExistence = function(routerArray) {
            routerArray.some(function(v, i, a) {
                if (newParentLink === v.displayText) {
                    res.send({ statusCode: 403, message: errorMessage });
                    parentLinkExists = true;
                    return true;
                }
                if (v.pages) {
                    checkParentLinkExistence(v.pages);
                }
            });
        };
        checkParentLinkExistence(headerModel);
        if (!parentLinkExists) {
            headerModel.push({
                "url": "#",
                "displayText": newParentLink,
                "locked": false,
                "pages": []
            });
            try {
                fs.writeFile(routerFile, JSON.stringify(headerModel), 'utf8', function(err) {
                    if (err) throw err;
                });
                res.send({ statusCode: 200, message: successMessage, routeTo: '/' });
            } catch (err) {
                console.error(err)
            }
        }
    });
}