#!/bin/bash

# ZKPJWT Circuit Trusted Setup Script
# This script automates the Groth16 trusted setup process for the Merkle membership circuit

set -e  # Exit on error

echo "🔐 ZKPJWT - Trusted Setup Script"
echo "================================"
echo ""

# Check if snarkjs is installed
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx (Node.js) is not installed"
    exit 1
fi

# Check if circom is installed
if ! command -v circom &> /dev/null; then
    echo "❌ Error: circom is not installed"
    echo "Install it with: cargo install --git https://github.com/iden3/circom.git"
    exit 1
fi

# Create build directory if it doesn't exist
mkdir -p build

echo "📝 Step 1: Compiling circuit..."
circom merkle_membership.circom --r1cs --wasm --sym -o build
echo "✅ Circuit compiled successfully"
echo ""

echo "🎲 Step 2: Generating Powers of Tau (Phase 1)..."
if [ ! -f "build/pot14_final.ptau" ]; then
    echo "  Creating new Powers of Tau ceremony (2^14 constraints)..."
    npx snarkjs powersoftau new bn128 14 build/pot14_0000.ptau
    
    echo "  Contributing to ceremony..."
    npx snarkjs powersoftau contribute build/pot14_0000.ptau build/pot14_0001.ptau \
        --name="First contribution" -e="$(date +%s)"
    
    echo "  Preparing Phase 2..."
    npx snarkjs powersoftau prepare phase2 build/pot14_0001.ptau build/pot14_final.ptau
    
    echo "✅ Powers of Tau ceremony completed"
else
    echo "  ℹ️  Using existing Powers of Tau file"
fi
echo ""

echo "🔑 Step 3: Generating proving key (Phase 2)..."
npx snarkjs groth16 setup build/merkle_membership.r1cs build/pot14_final.ptau build/merkle_0000.zkey

echo "  Contributing to zkey..."
npx snarkjs zkey contribute build/merkle_0000.zkey build/merkle_final.zkey \
    --name="Final contribution" -e="$(date +%s)"
echo "✅ Proving key generated"
echo ""

echo "📤 Step 4: Exporting verification key..."
npx snarkjs zkey export verificationkey build/merkle_final.zkey build/verification_key.json
echo "✅ Verification key exported"
echo ""

echo "🧹 Step 5: Cleaning up intermediate files..."
rm -f build/pot14_0000.ptau build/pot14_0001.ptau
rm -f build/merkle_0000.zkey
echo "✅ Cleanup complete"
echo ""

echo "📊 Summary:"
echo "  Circuit: build/merkle_membership_js/merkle_membership.wasm ($(du -h build/merkle_membership_js/merkle_membership.wasm | cut -f1))"
echo "  R1CS: build/merkle_membership.r1cs ($(du -h build/merkle_membership.r1cs | cut -f1))"
echo "  Proving key: build/merkle_final.zkey ($(du -h build/merkle_final.zkey | cut -f1))"
echo "  Verification key: build/verification_key.json ($(du -h build/verification_key.json | cut -f1))"
echo "  Powers of Tau: build/pot14_final.ptau ($(du -h build/pot14_final.ptau | cut -f1))"
echo ""

echo "✨ Trusted setup completed successfully!"
echo ""
echo "Next steps:"
echo "  1. Test proof generation: node test/generate_proof.js"
echo "  2. Deploy verification contract to Arbitrum Stylus"
echo ""
