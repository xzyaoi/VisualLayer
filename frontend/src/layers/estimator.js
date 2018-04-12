import * as tf from '@tensorflow/tfjs'
import { convNet } from '@/layers/models'
import { softmaxCrossEntropyLoss } from '@/layers/loss'

class Estimator {
  constructor (trainSteps, learningRate, batchSize) {
    this.trainSteps = trainSteps
    this.optimizer = tf.train.sgd(learningRate)
    this.batchSize = batchSize
    this.model = convNet
  }
  async train (data) {
    const returnCost = true
    for (let i = 0; i < 100; i++) {
      const cost = this.optimizer.minimize(() => {
        const batch = data.nextTrainBatch(64)
        return softmaxCrossEntropyLoss(batch.labels, self.model(batch.xs, 28))
      }, returnCost)
      console.log(cost.dataSync())
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
