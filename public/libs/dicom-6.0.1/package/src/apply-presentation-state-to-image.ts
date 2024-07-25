// Generated file. To retain edits, remove this comment.

import {
  BinaryFile,
  JsonCompatible,
  Image,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import ApplyPresentationStateToImageOptions from './apply-presentation-state-to-image-options.js'
import ApplyPresentationStateToImageResult from './apply-presentation-state-to-image-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

import { getDefaultWebWorker } from './default-web-worker.js'

/**
 * Apply a presentation state to a given DICOM image and render output as bitmap, or dicom file.
 *
 * @param {File | BinaryFile} imageIn - Input DICOM file
 * @param {File | BinaryFile} presentationStateFile - Process using presentation state file
 * @param {ApplyPresentationStateToImageOptions} options - options object
 *
 * @returns {Promise<ApplyPresentationStateToImageResult>} - result object
 */
async function applyPresentationStateToImage(
  imageIn: File | BinaryFile,
  presentationStateFile: File | BinaryFile,
  options: ApplyPresentationStateToImageOptions = {}
) : Promise<ApplyPresentationStateToImageResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonCompatible },
    { type: InterfaceTypes.Image },
  ]

  let imageInFile = imageIn
  if (imageIn instanceof File) {
    const imageInBuffer = await imageIn.arrayBuffer()
    imageInFile = { path: imageIn.name, data: new Uint8Array(imageInBuffer) }
  }
  let presentationStateFileFile = presentationStateFile
  if (presentationStateFile instanceof File) {
    const presentationStateFileBuffer = await presentationStateFile.arrayBuffer()
    presentationStateFileFile = { path: presentationStateFile.name, data: new Uint8Array(presentationStateFileBuffer) }
  }
  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.BinaryFile, data: imageInFile as BinaryFile },
    { type: InterfaceTypes.BinaryFile, data: presentationStateFileFile as BinaryFile },
  ]

  const args = []
  // Inputs
  const imageInName = (imageInFile as BinaryFile).path
  args.push(imageInName)

  const presentationStateFileName = (presentationStateFileFile as BinaryFile).path
  args.push(presentationStateFileName)

  // Outputs
  const presentationStateOutStreamName = '0'
  args.push(presentationStateOutStreamName)

  const outputImageName = '1'
  args.push(outputImageName)

  // Options
  args.push('--memory-io')
  if (options.colorOutput) {
    options.colorOutput && args.push('--color-output')
  }
  if (options.configFile) {
    args.push('--config-file', options.configFile.toString())

  }
  if (options.frame) {
    args.push('--frame', options.frame.toString())

  }
  if (options.noPresentationStateOutput) {
    options.noPresentationStateOutput && args.push('--no-presentation-state-output')
  }
  if (options.noBitmapOutput) {
    options.noBitmapOutput && args.push('--no-bitmap-output')
  }

  const pipelinePath = 'apply-presentation-state-to-image'

  let workerToUse = options?.webWorker
  if (workerToUse === undefined) {
    workerToUse = await getDefaultWebWorker()
  }
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline(pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl(), pipelineWorkerUrl: getPipelineWorkerUrl(), webWorker: workerToUse, noCopy: options?.noCopy })
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    webWorker: usedWebWorker as Worker,
    presentationStateOutStream: outputs[0]?.data as JsonCompatible,
    outputImage: outputs[1]?.data as Image,
  }
  return result
}

export default applyPresentationStateToImage
