// Illusione originale: fasce quadrate bianche alternate, ispirate a "Una figura è un quadrato".
// Riferimento: https://depositphotos.com/it/vector/a-figure-is-a-square-1339641.html
// I sei quadrati interni ingrandiscono insieme seguendo la stessa pulsazione.
// Parametri critici: canvasWidth = 600, canvasHeight = 600, squareCount = 13,
// outerSquareSize = 560, squareScale = 0.8,
// bandThicknessRatio = 0.06, pulseAmplitude = 0.32, pulseWaveStep = 0.12,
// pulseCycleFrames = 1200, approachingSquareCount = 6,
// approachingScaleMaximum = 3.85.

const canvasWidth = 600;
const canvasHeight = 600;
const black = 0;
const white = 255;
const squareCount = 13;
const outerSquareSize = 560;
const squareScale = 0.8;
const bandThicknessRatio = 0.06;
const minimumBandThickness = 1;
const pulseAmplitude = 0.32;
const pulseWaveStep = 0.12;
const pulseCycleFrames = 1200;
const approachingSquareCount = 6;
const approachingScaleMaximum = 3.85;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  noStroke();
}

function draw() {
  background(black);

  const pulseProgress = (frameCount % pulseCycleFrames) / pulseCycleFrames;
  const pulsePhase = TWO_PI * pulseProgress;
  const approachProgress = (1 - cos(pulsePhase)) / 2;

  for (let squareIndex = 0; squareIndex < squareCount; squareIndex++) {
    const baseOuterSize = outerSquareSize * Math.pow(squareScale, squareIndex);
    const bandThickness = Math.max(
      minimumBandThickness,
      baseOuterSize * bandThicknessRatio
    );
    const baseInnerSize = baseOuterSize - bandThickness;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const distanceFromCenter = squareCount - 1 - squareIndex;
    const initialPhase = distanceFromCenter < approachingSquareCount
      ? 0
      : -distanceFromCenter * pulseWaveStep;
    const currentPhase = pulsePhase + initialPhase;
    const pulseScale =
      1 + pulseAmplitude * (cos(initialPhase) - cos(currentPhase)) / 2;
    const approachScale = distanceFromCenter < approachingSquareCount
      ? lerp(1, approachingScaleMaximum, approachProgress)
      : 1;
    const squareScaleWithMotion = pulseScale * approachScale;
    const outerSquare = squareCorners(
      baseOuterSize * squareScaleWithMotion, centerX, centerY
    );
    const innerSquare = squareCorners(
      baseInnerSize * squareScaleWithMotion, centerX, centerY
    );

    drawSquareBand(outerSquare, innerSquare, white);
  }
}

function squareCorners(squareSize, centerX, centerY) {
  const halfSize = squareSize / 2;
  const offsets = [
    [-halfSize, -halfSize],
    [halfSize, -halfSize],
    [halfSize, halfSize],
    [-halfSize, halfSize]
  ];

  return offsets.map(([offsetX, offsetY]) => ({
    x: centerX + offsetX,
    y: centerY + offsetY
  }));
}

function drawSquareBand(outerSquare, innerSquare, shade) {
  fill(shade);

  for (let sideIndex = 0; sideIndex < 4; sideIndex++) {
    const nextSideIndex = (sideIndex + 1) % 4;

    beginShape();
    vertex(outerSquare[sideIndex].x, outerSquare[sideIndex].y);
    vertex(outerSquare[nextSideIndex].x, outerSquare[nextSideIndex].y);
    vertex(innerSquare[nextSideIndex].x, innerSquare[nextSideIndex].y);
    vertex(innerSquare[sideIndex].x, innerSquare[sideIndex].y);
    endShape(CLOSE);
  }
}
