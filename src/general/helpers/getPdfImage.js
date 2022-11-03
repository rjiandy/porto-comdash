// @flow
import pdfjsLib from 'pdfjs-dist';

type PDFFile = File & {preview: string};

let CanvasHelpers = {
  create(width, height) {
    let canvas = document.createElement('canvas');
    canvas.height = height;
    canvas.width = width;

    let context = canvas.getContext('2d');
    return {
      canvas: canvas,
      context: context,
    };
  },
  reset(canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  },
  destroy(canvasAndContext) {
    // Zeroing the width and height cause Firefox to release graphics
    // resources immediately, which can greatly reduce memory consumption.
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  },
};

// eslint-disable-next-line no-unused-vars
function canvasToURL(canvas) {
  return new Promise((resolve, reject) => {
    let callback = (blob) => {
      resolve(URL.createObjectURL(blob));
    };
    if (canvas.msToBlob) {
      canvas.msToBlob(callback, 'image/png');
    } else {
      canvas.toBlob(callback, 'image/png');
    }
  });
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise((resolve, reject) => {
    if (canvas.msToBlob) {
      // $FlowFixMe
      canvas.msToBlob(resolve, 'image/png');
    } else {
      canvas.toBlob(resolve, 'image/png');
    }
  });
}

function readFile(file: File) {
  return new Promise((resolve) => {
    let fileReader = new FileReader();
    fileReader.onload = () => {
      // $FlowFixMe
      let arrayBuffer: ArrayBuffer = fileReader.result;
      resolve(new Uint8Array(arrayBuffer));
    };
    fileReader.readAsArrayBuffer(file);
  });
}

export default async function getPdfImage(
  pdfFile: PDFFile,
  defaultPage?: number = 1
) {
  let pdfDocument;
  try {
    pdfDocument = await pdfjsLib.getDocument(pdfFile.preview);
  } catch (err) {
    let typedArray = await readFile(pdfFile);
    pdfDocument = await pdfjsLib.getDocument(typedArray);
  }
  let page = await pdfDocument.getPage(defaultPage);

  let viewport = page.getViewport(1.0);
  let canvasFactory = CanvasHelpers;
  let canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
  let renderContext = {
    canvasContext: canvasAndContext.context,
    viewport: viewport,
    canvasFactory: canvasFactory,
  };

  await page.render(renderContext);
  let {canvas} = canvasAndContext;
  let imageBlob = await canvasToBlob(canvas);
  return {image: canvas, imageBlob};
}
