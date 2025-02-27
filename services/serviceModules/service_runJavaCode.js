// save added page
exports.runJavaCode = function(app, fs, java) {
    return app.post('/runJavaCode', function(req, res) {
        var javaFile = 'services/java/OnlineJavaCompiler.java';
        var wrapperStart = 'class OnlineJavaCompiler {public static void main(String[] args) {';
        var wrapperEnd = '}}';
        var commands = wrapperStart + req.body['data[commands]'] + wrapperEnd;

        try {
            if (fs.existsSync(javaFile)) {
                // edit existing file
                fs.writeFile(javaFile, commands, 'utf8', function(err) {
                    java.runFile(javaFile, function(err, result) {
                        console.log(result.stderr);
                        messageObject = err ? { 'color': 'red', 'text': err } : (result.stderr ? { 'color': 'red', 'text': result.stderr } : { 'color': 'green', 'text': result.stdout });
                        res.send({ statusCode: 200, message: messageObject });
                    });
                });
            } else {
                // create a new file and write to it
                var writeStream = fs.createWriteStream(javaFile);
                writeStream.write(commands);
                writeStream.end();
                java.runFile(javaFile, function(err, result) {
                    console.log(result.stderr);
                    messageObject = err ? { 'color': 'red', 'text': err } : (result.stderr ? { 'color': 'red', 'text': result.stderr } : { 'color': 'green', 'text': result.stdout });
                    res.send({ statusCode: 200, message: messageObject });
                });
            }


        } catch (err) {
            console.error(err)
        }
    });
}