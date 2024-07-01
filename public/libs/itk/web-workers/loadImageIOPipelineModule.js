var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import loadPipelineModule from './loadPipelineModule.js';
import mimeToIO from '../io/internal/MimeToImageIO.js';
import extensionToIO from '../io/extensionToImageIO.js';
import getFileExtension from '../io/getFileExtension.js';
import ImageIOIndex from '../io/internal/ImageIOIndex.js';
import runPipelineEmscripten from '../pipeline/internal/runPipelineEmscripten.js';
function availableIOModules(input) {
    return __asyncGenerator(this, arguments, function* availableIOModules_1() {
        for (let idx = 0; idx < ImageIOIndex.length; idx++) {
            const trialIO = ImageIOIndex[idx] + '-read-image';
            const ioModule = yield __await(loadPipelineModule(trialIO, input.config.imageIOUrl));
            yield yield __await(ioModule);
        }
    });
}
async function loadImageIOPipelineModule(input, postfix) {
    var e_1, _a;
    if (input.mimeType && mimeToIO.has(input.mimeType)) {
        const io = mimeToIO.get(input.mimeType) + postfix;
        const ioModule = await loadPipelineModule(io, input.config.imageIOUrl);
        return ioModule;
    }
    const extension = getFileExtension(input.fileName);
    if (extensionToIO.has(extension)) {
        const io = extensionToIO.get(extension) + postfix;
        const ioModule = await loadPipelineModule(io, input.config.imageIOUrl);
        return ioModule;
    }
    for (let idx = 0; idx < ImageIOIndex.length; ++idx) {
        let idx = 0;
        try {
            for (var _b = (e_1 = void 0, __asyncValues(availableIOModules(input))), _c; _c = await _b.next(), !_c.done;) {
                const pipelineModule = _c.value;
                try {
                    const { returnValue, outputs } = await runPipelineEmscripten(pipelineModule, input.args, input.outputs, input.inputs);
                    if (returnValue === 0) {
                        return pipelineModule;
                    }
                }
                catch (error) {
                    // continue
                }
                idx++;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    throw Error(`Could not find IO for: ${input.fileName}`);
}
export default loadImageIOPipelineModule;
