import * as tf from '@tensorflow/tfjs'

function convNet (inputXs, imageSize) {
  const LABELS_SIZE = 10
  const conv1OutputDepth = 8
  const conv1Weights =
        tf.variable(tf.randomNormal([5, 5, 1, conv1OutputDepth], 0, 0.1))

  const conv2InputDepth = conv1OutputDepth
  const conv2OutputDepth = 16
  const conv2Weights = tf.variable(
        tf.randomNormal([5, 5, conv2InputDepth, conv2OutputDepth], 0, 0.1))

  const fullyConnectedWeights = tf.variable(tf.randomNormal(
        [7 * 7 * conv2OutputDepth, LABELS_SIZE], 0,
        1 / Math.sqrt(7 * 7 * conv2OutputDepth)))
  const fullyConnectedBias = tf.variable(tf.zeros([LABELS_SIZE]))

  const xs = inputXs.as4D(-1, imageSize, imageSize, 1)

  const strides = 2
  const pad = 0
  const layer1 = tf.tidy(() => {
    return xs.conv2d(conv1Weights, 1, 'same')
                .relu()
                .maxPool([2, 2], strides, pad)
  })

  const layer2 = tf.tidy(() => {
    return layer1.conv2d(conv2Weights, 1, 'same')
                .relu()
                .maxPool([2, 2], strides, pad)
  })

  return layer2.as2D(-1, fullyConnectedWeights.shape[0])
            .matMul(fullyConnectedWeights)
            .add(fullyConnectedBias)
}

export {
    convNet
}
