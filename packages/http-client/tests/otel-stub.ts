type Span = {
  setAttribute: (key: string, value: unknown) => void
  addEvent: (name: string) => void
  end: () => void
}

const noopSpan: Span = {
  setAttribute: () => {},
  addEvent: () => {},
  end: () => {}
}

const tracer = {
  startSpan: () => noopSpan,
  startActiveSpan: (_name: string, fn: (span: Span) => unknown) => fn(noopSpan)
}

export const trace = {
  getTracer: () => tracer
}

export const metrics = {
  getMeter: () => ({
    createCounter: () => ({ add: () => {} }),
    createHistogram: () => ({ record: () => {} }),
    createGauge: () => ({ record: () => {} })
  })
}

export const context = {
  active: () => ({}),
  with: (_ctx: unknown, fn: () => unknown) => fn()
}

export const propagation = {
  inject: () => {},
  extract: () => ({})
}

export const diag = {
  setLogger: () => {},
  debug: () => {}
}

export default { trace, metrics, context, propagation, diag }
