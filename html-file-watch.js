import $fs_promises from 'fs/promises';
import { MONGO_URI as $MONGO_URI } from './authentication/secrets.js';
import { MongoClient } from 'mongodb';
import * as $db_constants from './constants/DB_Constants.js';
import $EventEmitter from 'events';
import { ServerEvents as $ServerEvents } from './src/ServerEvents.js';
const HTMLChangeEvent = new $EventEmitter();
const watched_file = "./render-templates/";
await updateHTML_DB();
await watchFile();
async function updateHTML_DB() {
    const client = new MongoClient($MONGO_URI);
    try {
        await client.connect();
        console.log("Connected to DB");
        const db = client.db($db_constants.BEEHIVE_DB);
        const HTML_collection = db.collection($db_constants.MAIN_PAGE_HTML_SOURCE);
        HTMLChangeEvent.on($ServerEvents.HTML_CODE_CHANGED, async (event) => {
            console.log("event ", event);
            if (event.file && event.file[0]) {
                let result = await HTML_collection.updateOne({}, { $set: { [event.file[0]]: event.buffer } });
                console.log("result ", result);
                console.log("Updated DB...");
                HTMLChangeEvent.emit($ServerEvents.HTML_DB_UPDATED);
            }
        });
    }
    catch (e) {
        console.log("Some error");
    }
}
async function watchFile() {
    console.log("Waiting for file change...");
    const watcher = $fs_promises.watch(watched_file, { recursive: true });
    let ok_to_read = true;
    twirl();
    for await (const event of watcher) {
        if (ok_to_read) {
            try {
                let filename = "./render-templates/" + event.filename;
                console.log(filename);
                let fd = await $fs_promises.open(filename, 'r');
                let buffer = await fd.readFile();
                if (buffer.length > 0) {
                    console.log("\r" + "File changed...");
                    let filename_noext = event.filename.match(/^(\w*)/g);
                    console.log("filename ", filename);
                    HTMLChangeEvent.emit($ServerEvents.HTML_CODE_CHANGED, { file: filename_noext, buffer: buffer.toString() });
                    ok_to_read = false;
                    setTimeout(() => {
                        ok_to_read = true;
                    }, 100);
                }
                fd.close();
            }
            catch {
                console.log("Failed to open file...");
            }
        }
    }
}
function twirl() {
    const P = ["😐", "🥱", "🤨", "🤔", "😕", "🥱", "🙄"];
    var x = 0;
    let counter = 1;
    let timer;
    displayTwirl();
    function displayTwirl() {
        timer = setInterval(function () {
            process.stdout.write("\r" + P[x += counter]);
            counter = counter == 1 && x == P.length - 1 ? -1 : counter == -1 && x == 0 ? 1 : counter;
        }, 2000);
    }
    HTMLChangeEvent.on($ServerEvents.HTML_CODE_CHANGED, () => {
        clearTimeout(timer);
        x = 0;
        counter = 1;
    });
    HTMLChangeEvent.on($ServerEvents.HTML_DB_UPDATED, () => {
        displayTwirl();
    });
}
//# sourceMappingURL=html-file-watch.js.map