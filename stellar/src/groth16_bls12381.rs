// Groth16 verifier over BLS12-381 for Soroban
// Uses Stellar's native BLS12-381 host functions (CAP-0052)

use soroban_sdk::{Bytes, BytesN, Env, Vec, vec};

pub struct VerificationKey {
    pub alpha_g1: BytesN<96>,
    pub beta_g2: BytesN<192>,
    pub gamma_g2: BytesN<192>,
    pub delta_g2: BytesN<192>,
    pub ic: Vec<BytesN<96>>,
}

pub fn verify_groth16(
    env: &Env,
    vk: &VerificationKey,
    proof_a: BytesN<96>,
    proof_b: BytesN<192>,
    proof_c: BytesN<96>,
    public_signals: &[BytesN<32>],
) -> bool {
    let lhs = compute_linear_combination(env, &vk.ic, public_signals);

    let neg_proof_a = negate_g1(env, proof_a);

    let g1_points = vec![
        env,
        neg_proof_a,
        vk.alpha_g1.clone(),
        lhs,
        proof_c,
    ];

    let g2_points = vec![
        env,
        proof_b,
        vk.beta_g2.clone(),
        vk.gamma_g2.clone(),
        vk.delta_g2.clone(),
    ];

    let pairing_result = env.crypto().bls12_381_pairing(g1_points, g2_points);

    is_gt_identity(env, pairing_result)
}

fn compute_linear_combination(
    env: &Env,
    ic: &Vec<BytesN<96>>,
    public_signals: &[BytesN<32>],
) -> BytesN<96> {
    let mut acc = ic.get(0).unwrap();

    for (i, signal) in public_signals.iter().enumerate() {
        let ic_point = ic.get((i + 1) as u32).unwrap();
        let contribution = env.crypto().bls12_381_g1_mul(ic_point, signal.clone());
        acc = env.crypto().bls12_381_g1_add(acc, contribution);
    }

    acc
}

fn negate_g1(env: &Env, point: BytesN<96>) -> BytesN<96> {
    let mut bytes = point.to_array();

    // BLS12-381 G1 point is (x, y) each 48 bytes, compressed or uncompressed
    // For uncompressed (96 bytes): negate y coordinate
    // y is in bytes [48..96], negate in the BLS12-381 base field
    // Field prime p = 0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab
    let p: [u8; 48] = [
        0x1a, 0x01, 0x11, 0xea, 0x39, 0x7f, 0xe6, 0x9a,
        0x4b, 0x1b, 0xa7, 0xb6, 0x43, 0x4b, 0xac, 0xd7,
        0x64, 0x77, 0x4b, 0x84, 0xf3, 0x85, 0x12, 0xbf,
        0x67, 0x30, 0xd2, 0xa0, 0xf6, 0xb0, 0xf6, 0x24,
        0x1e, 0xab, 0xff, 0xfe, 0xb1, 0x53, 0xff, 0xff,
        0xb9, 0xfe, 0xff, 0xff, 0xff, 0xff, 0xaa, 0xab,
    ];

    let y = &bytes[48..96];
    let neg_y = sub_field_elements(&p, y);
    bytes[48..96].copy_from_slice(&neg_y);

    BytesN::from_array(env, &bytes)
}

fn sub_field_elements(p: &[u8; 48], a: &[u8]) -> [u8; 48] {
    let mut result = [0u8; 48];
    let mut borrow: u16 = 0;

    for i in (0..48).rev() {
        let pi = p[i] as u16;
        let ai = a[i] as u16;
        let diff = pi.wrapping_sub(ai).wrapping_sub(borrow);
        result[i] = diff as u8;
        borrow = if pi < ai + borrow { 1 } else { 0 };
    }

    result
}

fn is_gt_identity(_env: &Env, gt: BytesN<576>) -> bool {
    let bytes = gt.to_array();
    // GT identity in BLS12-381 Fp12:
    // [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] in the Fp12 basis
    // Represented as 576 bytes: first 48 bytes = 1 (big-endian), rest = 0
    let mut expected = [0u8; 576];
    expected[47] = 1;

    bytes == expected
}
