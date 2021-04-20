// JSONViewerDemo
exports.JSONViewerDemo = function(app, fs, java) {
    return app.post('/JSONViewerDemo', function(req, res) {
        var javaFile = 'services/java/JSONViewerDemo.java';

        try {
            java.runFile(javaFile, function(err, result) {
                console.log(result.stderr);
                messageObject = err ? { "color": "red", "text": err } : (result.stderr ? { "color": "red", "text": result.stderr } : { "color": "green", "text": result.stdout });
                res.send({ statusCode: 200, message: messageObject });
            });
        } catch (err) {
            console.error(err);
        }
    });
}