import exhbs from 'express-handlebars';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import hb from 'handlebars';
let db_html = null;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
(function start_server() {
    const app = express();
    registerStaticPaths(app);
    initRenderEngine(app);
    configureRoutes(app);
    const PORT = process.env.PORT ?? 8080;
    console.log("Listening on port ", PORT);
    app.listen(PORT);
})();
function registerPartials(db_html) {
    for (let key in db_html) {
        if (key.match(/^section/)) {
            console.log("Registered partial ", key);
            hb.registerPartial(key, db_html[key]);
        }
    }
}
function initRenderEngine(app) {
    app.engine('.html', exhbs({
        defaultLayout: 'index',
        extname: '.html',
    }));
    app.set('views', './render-templates');
    app.set('view engine', '.html');
}
function configureRoutes(app) {
    app.get('/', (req, res) => {
        res.render("index");
    });
}
function registerStaticPaths(app) {
    app.use('/css', express.static(path.join(__dirname, './css/')));
    app.use('/css/images', express.static(path.join(__dirname, './css/images')));
    app.use('/src', express.static(path.join(__dirname, './src')));
    app.use('/video', express.static(path.join(__dirname, './video/')));
    app.use('/images', express.static(path.join(__dirname, './images/')));
    app.use('/favicon', express.static(path.join(__dirname, './favicon/')));
    app.use('./', express.static(path.join(__dirname, './')));
}
//# sourceMappingURL=beehive-server.js.map