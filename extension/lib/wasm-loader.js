export async function loadWasm() {
    const wasm = await tf.wasm.ready;
    console.log('WASM backend ready:', wasm);
  }