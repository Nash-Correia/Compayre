export const buildNiceTicks = (maxValue: number, tickCount = 5): number[] => {
  if (maxValue <= 0) {
    return [0];
  }

  const roughStep = maxValue / Math.max(tickCount - 1, 1);
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const residual = roughStep / magnitude;

  let niceResidual: number;
  if (residual <= 1) {
    niceResidual = 1;
  } else if (residual <= 2) {
    niceResidual = 2;
  } else if (residual <= 5) {
    niceResidual = 5;
  } else {
    niceResidual = 10;
  }

  const step = niceResidual * magnitude;
  const niceMax = Math.ceil(maxValue / step) * step;
  const ticks: number[] = [];

  for (let value = 0; value <= niceMax; value += step) {
    ticks.push(value);
  }

  if (ticks[ticks.length - 1] !== niceMax) {
    ticks.push(niceMax);
  }

  return ticks;
};
