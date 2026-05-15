import { loadTF } from "./tf-loader";
import type { FaceBox } from "./types";

// Human is heavy; we lazy-load and keep a singleton.
// If load fails (e.g. WASM/canvas deps missing) we disable gracefully.

type HumanInstance = {
  load: () => Promise<void>;
  detect: (input: unknown) => Promise<any>;
  tf: any;
};

let humanPromise: Promise<HumanInstance | null> | null = null;

async function getHuman(): Promise<HumanInstance | null> {
  if (humanPromise) return humanPromise;
  humanPromise = (async () => {
    try {
      // @vladmandic/human's node build requires @tensorflow/tfjs-node (not installed).
      // The node-wasm subpath has a package.json exports bug on Node 22 so it also
      // can't be loaded without a workaround. We gracefully disable face detection
      // and return empty results. Face detection is non-critical; NSFWJS still runs.
      //
      // To enable face detection, install native bindings:
      //   npm install @tensorflow/tfjs-node
      //
      // eslint-disable-next-line no-eval
      const HumanMod = eval('require')("@vladmandic/human");
      const Human = HumanMod.default ?? HumanMod.Human ?? HumanMod;
      const human: HumanInstance = new Human({
        backend: "tensorflow",
        modelBasePath: "https://vladmandic.github.io/human/models/",
        face: {
          enabled: true,
          detector: { rotation: false, maxDetected: 10 },
          mesh: { enabled: false },
          iris: { enabled: false },
          description: { enabled: false },
          emotion: { enabled: false },
          gender: { enabled: true },
          age: { enabled: true },
        },
        body: { enabled: false },
        hand: { enabled: false },
        object: { enabled: false },
        gesture: { enabled: false },
      });
      await human.load();
      return human;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[moderation] face detection disabled (install @tensorflow/tfjs-node to enable):", (err as Error).message.split("\n")[0]);
      return null;
    }
  })();
  return humanPromise;
}

export async function detectFacesInBuffer(buffer: Buffer): Promise<FaceBox[]> {
  const human = await getHuman();
  if (!human) return [];
  const tf = await loadTF();

  let tensor: any;
  try {
    if ((tf as any).node?.decodeImage) {
      tensor = (tf as any).node.decodeImage(buffer, 3);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const sharp = require("sharp");
      const { data, info } = await sharp(buffer)
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      tensor = (tf as any).tensor3d(
        new Uint8Array(data),
        [info.height, info.width, 3],
        "int32"
      );
    }

    const result = await human.detect(tensor);
    const faces: FaceBox[] = (result.face || []).map((f: any) => ({
      x: Math.round(f.box?.[0] ?? 0),
      y: Math.round(f.box?.[1] ?? 0),
      w: Math.round(f.box?.[2] ?? 0),
      h: Math.round(f.box?.[3] ?? 0),
      gender: f.gender as FaceBox["gender"],
      genderScore: f.genderScore,
      age: f.age,
    }));
    return faces;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[moderation] face detection failed:", (err as Error).message);
    return [];
  } finally {
    if (tensor && typeof tensor.dispose === "function") tensor.dispose();
  }
}
