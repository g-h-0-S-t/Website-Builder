// delete current page
exports.deleteCurrentPage = function(app, fs, headerModel, routerFile) {
    return app.post('/deleteCurrentPage', function(req, res) {
        var fileName = req.body['data[fileName]'];
        var linkName = req.body['data[linkName]'];
        var textFile = 'views/pages/' + fileName + '.ejs';
        var message = 'Deleted -> File : ' + fileName + ', Link : ' + linkName;
        // remove link
        var removeLink = function(routerArray) {
            routerArray.some(function(v, i, a) {
                if (v.pages) {
                    removeLink(v.pages);
                } else if (linkName === v.displayText) {
                    routerArray.splice(i, 1);
                    return true;
                }
            });
        };
        removeLink(headerModel);
        fs.writeFile(routerFile, JSON.stringify(headerModel), 'utf8', function(err) {
            if (err) throw err;
        });
        //remove file
        fs.unlinkSync(textFile);
        res.send({ statusCode: 200, message: message, routeTo: '/' });
    });
}