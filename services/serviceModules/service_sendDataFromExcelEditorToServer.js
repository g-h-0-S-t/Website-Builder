// process Excel WorkBook
exports.processExcelWorkBook = function(app, fs, java) {
    return app.post('/sendDataFromExcelEditorToServer', function(req, res) {
        console.log('Excel WorkBook : ', req.body);
        res.send({ statusCode: 200, message: 'Excel Work Book processed' });
    });
}