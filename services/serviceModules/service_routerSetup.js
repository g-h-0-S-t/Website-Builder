var footerModel = require("../../model/footerModel.json");
var currentYear = new Date().getFullYear();
var parentLinks = [];

// setting up dynamic routes
exports.routerSetup = function(app, routerArray, headerModel) {
    routerArray.forEach(function(v, i, a) {
        if (v.pages) {
            parentLinks.push(v);
            exports.routerSetup(app, v.pages, headerModel);
        } else {
            app.get(v.url, function(req, res) {
                res.render('index', {
                    headerModel: headerModel,
                    footerModel: footerModel,
                    page: v.page,
                    pages: v.pages,
                    pageTitle: v.displayText,
                    parentLink: v.parentLink,
                    currentYear: currentYear,
                    locked: v.locked,
                    parentLinks: parentLinks
                });
            });
        }
    });
};