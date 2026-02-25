import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';

let net: mobilenet.MobileNet | null = null;
const classifier = knnClassifier.create();

export async function loadModel() {
    if (!net) {
        await tf.ready();
        // Use a faster version of MobileNet
        net = await mobilenet.load({ version: 1, alpha: 0.25 });
    }
    return net;
}

export async function addExample(imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement, classId: number) {
    const model = await loadModel();
    // Wrap in tf.tidy to prevent memory leaks
    const activation = tf.tidy(() => model.infer(imageElement, true));
    classifier.addExample(activation, classId);
    activation.dispose(); // Explicitly clean up
}

export async function predict(imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement) {
    const model = await loadModel();
    if (classifier.getNumClasses() === 0) {
        return null;
    }
    const activation = model.infer(imageElement, true);
    const result = await classifier.predictClass(activation);
    return result;
}

export function getClassifier() {
    return classifier;
}

export async function exportModel() {
    const dataset = classifier.getClassifierDataset();
    const datasetObj: { [key: string]: number[][] } = {};
    Object.keys(dataset).forEach((key) => {
        const data = dataset[key].arraySync();
        datasetObj[key] = data;
    });
    return JSON.stringify(datasetObj);
}

export async function importModel(jsonStr: string) {
    const datasetObj = JSON.parse(jsonStr);
    const dataset: { [key: string]: tf.Tensor2D } = {};
    Object.keys(datasetObj).forEach((key) => {
        dataset[key] = tf.tensor2d(datasetObj[key], [datasetObj[key].length, 1024]);
    });
    classifier.setClassifierDataset(dataset);
}

export function clearClassifier() {
    classifier.clearAllClasses();
}
