// Generated file. To retain edits, remove this comment.

import {
  Image,
  JsonCompatible,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import ReadImageDicomFileSeriesNodeOptions from './read-image-dicom-file-series-node-options.js'
import ReadImageDicomFileSeriesNodeResult from './read-image-dicom-file-series-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Read a DICOM image series and return the associated image volume
 *
 * @param {ReadImageDicomFileSeriesNodeOptions} options - options object
 *
 * @returns {Promise<ReadImageDicomFileSeriesNodeResult>} - result object
 */
async function readImageDicomFileSeriesNode(
  options: ReadImageDicomFileSeriesNodeOptions = { inputImages: [] as string[], }
) : Promise<ReadImageDicomFileSeriesNodeResult> {

  const mountDirs: Set<string> = new Set()

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.Image },
    { type: InterfaceTypes.JsonCompatible },
  ]

  const inputs: Array<PipelineInput> = [
  ]

  const args = []
  // Inputs
  // Outputs
  const outputImageName = '0'
  args.push(outputImageName)

  const sortedFilenamesName = '1'
  args.push(sortedFilenamesName)

  // Options
  args.push('--memory-io')
  if (options.inputImages) {
    if(options.inputImages.length < 1) {
      throw new Error('"input-images" option must have a length > 1')
    }
    args.push('--input-images')

    options.inputImages.forEach((value) => {
      mountDirs.add(path.dirname(value as string))
      args.push(value as string)
    })
  }
  if (options.singleSortedSeries) {
    options.singleSortedSeries && args.push('--single-sorted-series')
  }

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'read-image-dicom-file-series')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs, mountDirs)
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    outputImage: outputs[0]?.data as Image,
    sortedFilenames: outputs[1]?.data as JsonCompatible,
  }
  return result
}

export default readImageDicomFileSeriesNode
