import { MongoClient } from 'mongodb';
import EventEmitter from 'events';
import { ServerEvents } from '../constants/ServerEvents.js';
export async function connectDB() {
    return Promise.resolve();
}
export async function watchHTML_DB(db_path, DB, collection) {
    const HTMLChangeEvent = new EventEmitter();
    const client = new MongoClient(db_path);
    try {
        await client.connect();
        const db = client.db(DB);
        const HTML_collection = db.collection(collection);
        const HTML_changeStream = HTML_collection.watch();
        HTML_changeStream.on("change", (change) => {
            let htmlData = change.operationType === 'replace' ? change.fullDocument : change.updateDescription?.updatedFields;
            HTMLChangeEvent.emit(ServerEvents.HTML_CODE_CHANGED, htmlData);
        });
    }
    catch (e) {
        console.log("Something went wrong reading HTML DB ", e);
    }
    return HTMLChangeEvent;
}
export async function getHTML_DB(db_path, DB, collection) {
    const client = new MongoClient(db_path);
    let html_data;
    try {
        await client.connect();
        const db = client.db(DB);
        const HTML_collection = db.collection(collection);
        html_data = await HTML_collection.aggregate([{ $project: { _id: 0 } }]).next();
        client.close();
        return html_data;
    }
    catch (e) {
        console.log("Something went wrong reading html DB ", e);
        return Promise.resolve(null);
    }
}
//# sourceMappingURL=db-init.js.map