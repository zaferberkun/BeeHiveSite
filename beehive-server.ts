import exhbs from 'express-handlebars';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { EventEmitter } from 'events';
import * as $db_constants from './constants/DB_Constants.js';
import { Document } from 'mongodb';
import hb from 'handlebars';
import { ServerEvents } from './constants/ServerEvents.js';
import * as dbinit from './db/db-init.js';
import { MONGO_URI } from './authentication/secrets.js'

let db_html: Document | null = null;

// Set a __dirname const to make life a little easier.
const __dirname = path.dirname(fileURLToPath(import.meta.url));


(function start_server() {

  const app = express();

  registerStaticPaths(app);
  initRenderEngine(app);
  configureRoutes(app);

  // Start the server.
  const PORT = process.env.PORT ?? 8080;
  console.log("Listening on port ", PORT);

  app.listen(PORT);

})();



/**
 * @description
 * Register partials with handlebars from the contents of a given object.
 * Partials are the keys in the given object that begin with the keyword "section"
 * 
 * @param db_html The obj that contains the partials in the form {section<section_name>:<handlebars template>, section<section_name>...}
 */
function registerPartials(db_html) {
  for (let key in db_html) {
    if (key.match(/^section/)) {
      console.log("Registered partial ", key)
      hb.registerPartial(key, db_html[key]);
    }
  }
}

function initRenderEngine(app) {
  //Register "Handlebars" as our HTML rendering engine
  app.engine('.html', exhbs({
    defaultLayout: 'index',
    extname: '.html',// change default extension to 'hbs'
  }));
  app.set('views', './render-templates'); //Point express to where our html templates are.
  app.set('view engine', '.html');//Set express to render hbs files.
}


/**
 * @param app - Our instance of the Express app.
*/
function configureRoutes(app) {

  // Render the "home page". 
  app.get('/', (req, res) => {
    // return res.sendFile("./story.html", { root: __dirname })
    res.render("index");
  });
}


/**
 * @description
 * Register the paths for static data files.
 * 
 * @param app - Our instance of the Express app.
*/
function registerStaticPaths(app) {
  app.use('/css', express.static(path.join(__dirname, './css/')));
  app.use('/css/images', express.static(path.join(__dirname, './css/images')));
  app.use('/src', express.static(path.join(__dirname, './src')));
  app.use('/video', express.static(path.join(__dirname, './video/')));
  app.use('/images', express.static(path.join(__dirname, './images/')));
  app.use('/favicon', express.static(path.join(__dirname, './favicon/')));
  app.use('./', express.static(path.join(__dirname, './')));

} // registerStaticPaths