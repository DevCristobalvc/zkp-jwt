/**
 * Type declarations for snarkjs
 */

declare module 'snarkjs' {
  export namespace groth16 {
    export function fullProve(
      input: any,
      wasmFile: string | Uint8Array,
      zkeyFileName: string | Uint8Array
    ): Promise<{ proof: any; publicSignals: string[] }>;

    export function verify(
      vKey: any,
      publicSignals: string[],
      proof: any
    ): Promise<boolean>;

    export function exportSolidityCallData(proof: any, publicSignals: string[]): Promise<string>;
  }

  export namespace plonk {
    export function fullProve(
      input: any,
      wasmFile: string | Uint8Array,
      zkeyFileName: string | Uint8Array
    ): Promise<{ proof: any; publicSignals: string[] }>;

    export function verify(
      vKey: any,
      publicSignals: string[],
      proof: any
    ): Promise<boolean>;
  }

  export namespace zKey {
    export function exportVerificationKey(zkeyName: string | Uint8Array): Promise<any>;
  }
}
