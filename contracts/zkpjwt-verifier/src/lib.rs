//!
//! ZKPJWT Verifier - Arbitrum Stylus Contract
//!
//! This contract verifies Groth16 zero-knowledge proofs for Merkle tree membership,
//! enabling privacy-preserving access control on Arbitrum.
//!
//! Basic implementation for T1.5 - establishes contract structure.
//! Full Groth16 verification will be implemented in T1.6.
//!

#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]
#![cfg_attr(not(any(test, feature = "export-abi")), no_std)]

extern crate alloc;

use alloc::vec;
use alloc::vec::Vec;

use stylus_sdk::{
    alloy_primitives::{Address, U256},
    prelude::*,
};

// Define persistent storage
sol_storage! {
    #[entrypoint]
    pub struct ZKPJWTVerifier {
        uint256 merkle_root;
        address owner;
    }
}

const ONLY_OWNER: &str = "Only owner can call this function";
const ROOT_MISMATCH: &str = "Merkle root does not match";

#[public]
impl ZKPJWTVerifier {
    pub fn init(&mut self) {
        let caller = self.vm().msg_sender();
        self.owner.set(caller);
    }
    
    pub fn get_root(&self) -> U256 {
        self.merkle_root.get()
    }
    
    pub fn set_root(&mut self, new_root: U256) -> Result<(), Vec<u8>> {
        if self.vm().msg_sender() != self.owner.get() {
            return Err(ONLY_OWNER.as_bytes().to_vec());
        }
        self.merkle_root.set(new_root);
        Ok(())
    }
    
    pub fn get_owner(&self) -> Address {
        self.owner.get()
    }
    
    pub fn transfer_ownership(&mut self, new_owner: Address) -> Result<(), Vec<u8>> {
        if self.vm().msg_sender() != self.owner.get() {
            return Err(ONLY_OWNER.as_bytes().to_vec());
        }
        self.owner.set(new_owner);
        Ok(())
    }
    
    pub fn verify_proof(&self, proof_root: U256) -> Result<bool, Vec<u8>> {
        let stored_root = self.merkle_root.get();
        if proof_root != stored_root {
            return Err(ROOT_MISMATCH.as_bytes().to_vec());
        }
        Ok(true)
    }
}
