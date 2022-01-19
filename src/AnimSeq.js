"use strict";
const NOT_RUNNING = 0;
const DONE = 1;
const RUNNING = 2;
const COMPLETE = 3;
class AnimSequence {
    seq;
    elem;
    transDone;
    prevStatus;
    status;
    transStarted;
    needsHandler;
    id;
    key;
    static id = 0;
    constructor(seq, elem, key) {
        this.id = AnimSequence.id++;
        this.seq = seq;
        this.elem = elem;
        this.transDone = true;
        this.status = NOT_RUNNING;
        this.prevStatus = NOT_RUNNING;
        this.transStarted = 0;
        this.needsHandler = true;
        this.key = key;
    }
    play(id) {
        this.status = this.seq(this.key);
        if ((this.status == RUNNING || this.status == DONE) && this.prevStatus != RUNNING) {
            this.prevStatus = this.status;
            this.transDone = false;
            return new Promise((resolve, reject) => {
                if (this.needsHandler) {
                    this.needsHandler = false;
                    this.elem.addEventListener('transitionend', () => {
                        if ((this.status) == COMPLETE) {
                            this.transDone = true;
                            return Promise.resolve(true);
                        }
                        else {
                            return Promise.resolve(false);
                        }
                    });
                }
            });
        }
        else if (this.status == COMPLETE && this.transDone) {
            this.prevStatus = this.status;
            return Promise.resolve(true);
        }
        else {
            this.prevStatus = this.status;
            return Promise.resolve(false);
        }
    }
    logger(f) {
        if (this.id == 0) {
            f();
        }
    }
}
//# sourceMappingURL=AnimSeq.js.map