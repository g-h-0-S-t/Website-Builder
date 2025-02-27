// fetching page string for editing
exports.fetchDataForEditingCurrentPage = function(app, fs) {
    return app.get("/fetchDataForEditingCurrentPage/:fileName", function(req, res) {
        var fileName = req.params.fileName;
        var textFile = 'views/pages/' + fileName + '.ejs';
        fs.readFile(textFile, 'utf8', function(err, data) {
            if (err) throw err;
            return res.json({
                fileName: fileName,
                content: data
            });
        });
    });
}