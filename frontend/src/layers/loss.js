import * as tf from '@tensorflow/tfjs'

function softmaxCrossEntropyLoss (labels, ys) {
  return tf.losses.softmaxCrossEntropy(labels, ys).mean()
}

export {
  softmaxCrossEntropyLoss
}
