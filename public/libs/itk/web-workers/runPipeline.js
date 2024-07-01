import registerWebworker from 'webworker-promise/lib/register.js';
import runPipelineEmscripten from '../pipeline/internal/runPipelineEmscripten.js';
import IOTypes from '../core/IOTypes.js';
import getTransferable from '../core/getTransferable.js';
import InterfaceTypes from '../core/InterfaceTypes.js';
import meshTransferables from '../core/internal/meshTransferables.js';
import polyDataTransferables from '../core/internal/polyDataTransferables.js';
async function runPipeline(pipelineModule, args, outputs, inputs) {
    const result = runPipelineEmscripten(pipelineModule, args, outputs, inputs);
    const transferables = [];
    if (result.outputs) {
        result.outputs.forEach(function (output) {
            if (output.type === InterfaceTypes.BinaryStream || output.type === InterfaceTypes.BinaryFile) {
                // Binary data
                const binary = output.data;
                const transferable = getTransferable(binary);
                if (transferable) {
                    transferables.push(transferable);
                }
            }
            else if (output.type === InterfaceTypes.Image) {
                // Image data
                const image = output.data;
                let transferable = getTransferable(image.data);
                if (transferable) {
                    transferables.push(transferable);
                }
                transferable = getTransferable(image.direction);
                if (transferable) {
                    transferables.push(transferable);
                }
            }
            else if (output.type === InterfaceTypes.Mesh) {
                const mesh = output.data;
                const mt = meshTransferables(mesh);
                transferables.push(...mt);
            }
            else if (output.type === InterfaceTypes.PolyData) {
                const polyData = output.data;
                const pt = polyDataTransferables(polyData);
                transferables.push(...pt);
            }
            else if (output.type === IOTypes.Binary) {
                // Binary data
                const binary = output.data;
                const transferable = getTransferable(binary);
                if (transferable) {
                    transferables.push(transferable);
                }
            }
            else if (output.type === IOTypes.Image) {
                // Image data
                const image = output.data;
                let transferable = getTransferable(image.data);
                if (transferable) {
                    transferables.push(transferable);
                }
                transferable = getTransferable(image.direction);
                if (transferable) {
                    transferables.push(transferable);
                }
            }
            else if (output.type === IOTypes.Mesh) {
                // Mesh data
                const mesh = output.data;
                if (mesh.points) {
                    const transferable = getTransferable(mesh.points);
                    if (transferable) {
                        transferables.push(transferable);
                    }
                }
                if (mesh.pointData) {
                    const transferable = getTransferable(mesh.pointData);
                    if (transferable) {
                        transferables.push(transferable);
                    }
                }
                if (mesh.cells) {
                    const transferable = getTransferable(mesh.cells);
                    if (transferable) {
                        transferables.push(transferable);
                    }
                }
                if (mesh.cellData) {
                    const transferable = getTransferable(mesh.cellData);
                    if (transferable) {
                        transferables.push(transferable);
                    }
                }
            }
        });
    }
    return new registerWebworker.TransferableResponse(result, transferables);
}
export default runPipeline;
