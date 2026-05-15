// TensorFlow loader with native-binding fallback.
// Prefers `@tensorflow/tfjs-node` (native, fast) but falls back to
// `@tensorflow/tfjs` (pure JS) if the native bindings aren't installed
// or fail to load (common on Windows without build tools).

type TF = typeof import("@tensorflow/tfjs");

let cached: Promise<TF> | null = null;
let usingNative = false;

export async function loadTF(): Promise<TF> {
  if (cached) return cached;
  cached = (async () => {
    try {
      // Use eval to prevent Turbopack/webpack from statically analyzing
      // and failing at compile time when @tensorflow/tfjs-node is absent.
      // eslint-disable-next-line no-eval
      const mod = eval('require')("@tensorflow/tfjs-node");
      usingNative = true;
      return mod as unknown as TF;
    } catch {
      const mod = await import("@tensorflow/tfjs");
      usingNative = false;
      return mod;
    }
  })();
  return cached;
}

export function isNativeTF() {
  return usingNative;
}
