/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }] */
import * as tf from '@tensorflow/tfjs'

export class MnistData {
  constructor (TEST_RATIO) {
    this.shuffledTrainIndex = 0
    this.shuffledTestIndex = 0
    this.IMAGE_SIZE = 784
    this.NUM_CLASSES = 10
    this.NUM_DATASET_ELEMENTS = 65000
    this.TRAIN_TEST_RATIO = 1 - TEST_RATIO
    this.NUM_TRAIN_ELEMENTS = Math.floor(this.TRAIN_TEST_RATIO * this.NUM_DATASET_ELEMENTS)
    this.NUM_TEST_ELEMENTS = this.NUM_DATASET_ELEMENTS - this.NUM_TRAIN_ELEMENTS
    this.MNIST_IMAGES_SPRITE_PATH = 'https://storage.googleapis.com/learnjs-data/model-builder/mnist_images.png'
    this.MNIST_LABELS_PATH = 'https://storage.googleapis.com/learnjs-data/model-builder/mnist_labels_uint8'
  }
  async load () {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const imgRequest = new Promise((resolve, reject) => {
      img.crossOrigin = ''
      try {
        img.onload = () => {
          img.width = img.naturalWidth
          img.height = img.naturalHeight

          const datasetBytesBuffer =
                      new ArrayBuffer(this.NUM_DATASET_ELEMENTS * this.IMAGE_SIZE * 4)
          const chunkSize = 5000
          canvas.width = img.width
          canvas.height = chunkSize

          for (let i = 0; i < this.NUM_DATASET_ELEMENTS / chunkSize; i++) {
            const datasetBytesView = new Float32Array(
                          datasetBytesBuffer, i * this.IMAGE_SIZE * chunkSize * 4,
                          this.IMAGE_SIZE * chunkSize
                      )

            ctx.drawImage(
                          img, 0, i * chunkSize, img.width, chunkSize, 0, 0, img.width, chunkSize
                      )

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

            for (let j = 0; j < imageData.data.length / 4; j++) {
              datasetBytesView[j] = imageData.data[j * 4] / 255
            }
          }

          this.datasetImages = new Float32Array(datasetBytesBuffer)
          resolve()
        }
      } catch (error) {
        reject(error)
      }
      img.src = this.MNIST_IMAGES_SPRITE_PATH
    })

    const labelsRequest = fetch(this.MNIST_LABELS_PATH, {mode: 'arraybuffer'})
    const [imgResponseIgnored, labelsResponse] =
            await Promise.all([imgRequest, labelsRequest])

    this.datasetLabels = new Uint8Array(await labelsResponse.arrayBuffer())
    this.trainIndices = tf.util.createShuffledIndices(this.NUM_TRAIN_ELEMENTS)
    this.testIndices = tf.util.createShuffledIndices(this.NUM_TEST_ELEMENTS)

    this.trainImages = this.datasetImages.slice(0, this.IMAGE_SIZE * this.NUM_TRAIN_ELEMENTS)
    this.testImages = this.datasetImages.slice(this.IMAGE_SIZE * this.NUM_TRAIN_ELEMENTS)

    this.trainLabels = this.datasetLabels.slice(0, this.NUM_CLASSES * this.NUM_TRAIN_ELEMENTS)
    this.testLabels = this.datasetLabels.slice(this.NUM_CLASSES * this.NUM_TRAIN_ELEMENTS)
  }
  nextTrainBatch (batchSize) {
    return this.nextBatch(
            batchSize, [this.trainImages, this.trainLabels], () => {
              this.shuffledTrainIndex =
                    (this.shuffledTrainIndex + 1) % this.trainIndices.length
              return this.trainIndices[this.shuffledTrainIndex]
            }
        )
  }
  nextTestBatch (batchSize) {
    return this.nextBatch(batchSize, [this.testImages, this.testLabels], () => {
      this.shuffledTestIndex =
                (this.shuffledTestIndex + 1) % this.testIndices.length
      return this.testIndices[this.shuffledTestIndex]
    })
  }
  nextBatch (batchSize, data, index) {
    const batchImagesArray = new Float32Array(batchSize * this.IMAGE_SIZE)
    const batchLabelsArray = new Uint8Array(batchSize * this.NUM_CLASSES)
    for (let i = 0; i < batchSize; i++) {
      const idx = index()
      const image =
                data[0].slice(idx * this.IMAGE_SIZE, idx * this.IMAGE_SIZE, +this.IMAGE_SIZE)
      batchImagesArray.set(image, i * this.IMAGE_SIZE)
      const label =
                data[1].slice(idx * this.NUM_CLASSES, idx * this.NUM_CLASSES + this.NUM_CLASSES)
      batchLabelsArray.set(label, i * this.NUM_CLASSES)
    }

    const xs = tf.tensor2d(batchImagesArray, [batchSize, this.IMAGE_SIZE])
    const labels = tf.tensor2d(batchLabelsArray, [batchSize, this.NUM_CLASSES])
    return {xs, labels}
  }
}
