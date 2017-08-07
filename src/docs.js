import Indicator from './Indicator.html'

const makeIndicator = data => {
  const div = document.createElement('div')
  div.style.margin = '30px 50px'
  div.style.display = 'inline-block'
  div.style.verticalAlign = 'middle'
  document.body.appendChild(div)
  return new Indicator({ target: div, data })
}

const demoStep = (indicator, ratio, resetFn) => {
  if (ratio > 1.8) { return resetFn() }
  window.requestAnimationFrame(() => {
    indicator.set({ progressRatio: ratio + 0.01 })
    demoStep(indicator, ratio + 0.01, resetFn)
  })
}

{
  const indicator = makeIndicator()
  const resetFn = () => setTimeout(() => demoStep(indicator, 0, resetFn), 1000)
  demoStep(indicator, 0, resetFn)
}

makeIndicator()

{
  const indicator = makeIndicator()
  const resetFn = () => {
    setTimeout(() => indicator.set({ progressRatio: undefined }), 100)
    setTimeout(() => demoStep(indicator, 0, resetFn), 3300)
  }
  demoStep(indicator, 0, resetFn)
}

{
  const indicator = makeIndicator({ size: 75, emphasized: true })
  const resetFn = () => {
    setTimeout(() => indicator.set({ progressRatio: undefined }), 100)
    setTimeout(() => demoStep(indicator, 0, resetFn), 3300)
  }
  demoStep(indicator, 0, resetFn)
}
