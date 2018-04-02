import * as tf from '@tensorflow/tfjs'
import { convNet } from '@/layers/models'
import { softmaxCrossEntropyLoss } from '@/layers/loss'

const optimizer = tf.train.sgd(0.000001)

class Estimator {
  constructor (trainSteps, learningRate, batchSize) {
    this.trainSteps = trainSteps
    this.optimizer = tf.train.sgd(learningRate)
    this.batchSize = batchSize
    this.model = convNet
  }
  async train (data) {
    const returnCost = true
    for (let i = 0; i < this.trainSteps; i++) {
      const cost = optimizer.minimize(() => {
        const batch = data.nextTrainBatch(this.batchSize)
        console.log(batch)
        return softmaxCrossEntropyLoss(batch.labels, this.model(batch.xs, 28))
      }, returnCost)
      console.log('step [' + i + '] for loss = ' + cost.dataSync())
      await tf.nextFrame()
    }
  }
  predict (x) {
    const pred = tf.tidy(() => {
      const axis = 1
      return this.model(x).argMax(axis)
    })
    return Array.from(pred.dataSync())
  }
}

export {
    Estimator
}
