//delete empty parent link
exports.deleteEmptyParentLink = function(app, fs, headerModel, routerFile) {
    return app.post('/deleteEmptyParentLink', function(req, res) {
        var parentLinkName = req.body['data[parentLinkName]'];
        var message = 'Removed parent link ' + parentLinkName;
        // remove link
        headerModel.some(function(v, i, a) {
            if (v.pages && v.pages.length === 0 && parentLinkName === v.displayText) {
                headerModel.splice(i, 1);
                return true;
            }
        });
        fs.writeFile(routerFile, JSON.stringify(headerModel), 'utf8', function(err) {
            if (err) throw err;
        });
        res.send({ statusCode: 200, message: message, routeTo: '/' });
    });
}