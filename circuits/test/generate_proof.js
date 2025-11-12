/**
 * ZKPJWT - Proof Generation Script
 * 
 * This script:
 * 1. Constructs a Merkle tree with test wallet addresses
 * 2. Generates a zero-knowledge proof for a valid wallet
 * 3. Verifies the proof locally
 * 4. Tests with an invalid wallet (should fail)
 */

const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");
const { buildPoseidon } = require("circomlibjs");

// Constants
const LEVELS = 10;
const MAX_LEAVES = 2 ** LEVELS; // 1024

/**
 * Convert Ethereum address to field element
 */
function addressToFieldElement(address) {
  // Remove 0x prefix if present
  const cleanAddress = address.toLowerCase().replace('0x', '');
  return BigInt('0x' + cleanAddress);
}

/**
 * Build Merkle tree from addresses
 */
async function buildMerkleTree(addresses, poseidon) {
  console.log(`📊 Building Merkle tree with ${addresses.length} addresses...`);
  
  // Convert addresses to field elements and hash them (like the circuit does)
  const leaves = addresses.map(addr => {
    const fieldElement = addressToFieldElement(addr);
    // Hash the address with Poseidon(1) - same as circuit leaf hash
    const hash = poseidon([fieldElement]);
    return BigInt(poseidon.F.toString(hash));
  });
  
  console.log(`   Initial leaves: ${leaves.length}`);
  
  // Pad to power of 2 with zero hashes
  const zeroLeaf = poseidon([0n]);
  const zeroLeafHash = BigInt(poseidon.F.toString(zeroLeaf));
  
  console.log(`   Padding with zero hash: ${zeroLeafHash.toString().substring(0, 20)}...`);
  
  while (leaves.length < MAX_LEAVES) {
    leaves.push(zeroLeafHash);
  }
  
  console.log(`   Total leaves after padding: ${leaves.length}`);
  
  // Build tree bottom-up
  let currentLevel = leaves;
  const tree = [currentLevel];
  
  for (let level = 0; level < LEVELS; level++) {
    const nextLevel = [];
    
    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i];
      const right = currentLevel[i + 1];
      
      // Hash pair using Poseidon(2) - same as circuit internal nodes
      const hash = poseidon([left, right]);
      const hashValue = poseidon.F.toString(hash);
      nextLevel.push(BigInt(hashValue));
    }
    
    tree.push(nextLevel);
    currentLevel = nextLevel;
  }
  
  const root = tree[LEVELS][0];
  console.log(`✅ Merkle root: ${root.toString()}`);
  
  return { tree, root, leaves };
}

/**
 * Get Merkle proof for an address at specific index
 */
function getMerkleProof(tree, index) {
  const siblings = [];
  const pathIndices = [];
  
  let currentIndex = index;
  
  for (let level = 0; level < LEVELS; level++) {
    const isLeft = currentIndex % 2 === 0;
    const siblingIndex = isLeft ? currentIndex + 1 : currentIndex - 1;
    
    siblings.push(tree[level][siblingIndex].toString());
    // pathIndices: 0 if current is left, 1 if current is right
    pathIndices.push(isLeft ? 0 : 1);
    
    currentIndex = Math.floor(currentIndex / 2);
  }
  
  return { siblings, pathIndices };
}

/**
 * Generate proof for a wallet address
 */
async function generateProof(address, tree, index, root) {
  console.log(`\n🔐 Generating proof for address: ${address}`);
  console.log(`   Index in tree: ${index}`);
  
  const addressField = addressToFieldElement(address);
  const { siblings, pathIndices } = getMerkleProof(tree, index);
  
  // Prepare input for circuit
  const input = {
    address: addressField.toString(),
    pathIndices: pathIndices,
    siblings: siblings,
    root: root.toString()
  };
  
  // Save input for debugging
  const inputPath = path.join(__dirname, '../build/input.json');
  fs.writeFileSync(inputPath, JSON.stringify(input, null, 2));
  console.log(`   📝 Input saved to: ${inputPath}`);
  
  // Generate witness
  console.log(`   ⚙️  Calculating witness...`);
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    input,
    path.join(__dirname, '../build/merkle_membership_js/merkle_membership.wasm'),
    path.join(__dirname, '../build/merkle_final.zkey')
  );
  
  console.log(`   ✅ Proof generated successfully`);
  console.log(`   📊 Public signals: ${JSON.stringify(publicSignals)}`);
  
  return { proof, publicSignals };
}

/**
 * Verify proof locally
 */
async function verifyProof(proof, publicSignals) {
  console.log(`\n🔍 Verifying proof locally...`);
  
  const vKey = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../build/verification_key.json'))
  );
  
  const verified = await snarkjs.groth16.verify(vKey, publicSignals, proof);
  
  if (verified) {
    console.log(`   ✅ Proof verification PASSED`);
  } else {
    console.log(`   ❌ Proof verification FAILED`);
  }
  
  return verified;
}

/**
 * Main execution
 */
async function main() {
  console.log("🚀 ZKPJWT - Proof Generation Test\n");
  console.log("=" .repeat(60));
  
  try {
    // Initialize Poseidon
    console.log("🔧 Initializing Poseidon hash...");
    const poseidon = await buildPoseidon();
    console.log("✅ Poseidon initialized\n");
    
    // Test addresses (simulating whitelist)
    const testAddresses = [
      "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",  // Address 0
      "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",  // Address 1
      "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",  // Address 2
      "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",  // Address 3
      "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB",  // Address 4
      "0x617F2E2fD72FD9D5503197092aC168c91465E7f2",  // Address 5
      "0x17F6AD8Ef982297579C203069C1DbfFE4348c372",  // Address 6
      "0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678",  // Address 7
    ];
    
    // Build Merkle tree
    const { tree, root, leaves } = await buildMerkleTree(testAddresses, poseidon);
    
    // Test Case 1: Valid proof (wallet in whitelist)
    console.log("\n" + "=".repeat(60));
    console.log("TEST CASE 1: Valid Wallet (in whitelist)");
    console.log("=".repeat(60));
    
    const validAddress = testAddresses[3]; // Use address at index 3
    const validIndex = 3;
    
    const { proof: validProof, publicSignals: validSignals } = 
      await generateProof(validAddress, tree, validIndex, root);
    
    const validResult = await verifyProof(validProof, validSignals);
    
    if (validResult) {
      console.log("\n✅ TEST CASE 1 PASSED: Valid wallet generated valid proof");
    } else {
      console.log("\n❌ TEST CASE 1 FAILED: Valid wallet should generate valid proof");
      process.exit(1);
    }
    
    // Save valid proof
    const proofPath = path.join(__dirname, '../build/proof.json');
    const publicPath = path.join(__dirname, '../build/public.json');
    fs.writeFileSync(proofPath, JSON.stringify(validProof, null, 2));
    fs.writeFileSync(publicPath, JSON.stringify(validSignals, null, 2));
    console.log(`\n💾 Proof saved to: ${proofPath}`);
    console.log(`💾 Public signals saved to: ${publicPath}`);
    
    // Test Case 2: Invalid proof (wallet NOT in whitelist)
    console.log("\n" + "=".repeat(60));
    console.log("TEST CASE 2: Invalid Wallet (not in whitelist)");
    console.log("=".repeat(60));
    
    const invalidAddress = "0x0000000000000000000000000000000000000001";
    
    try {
      // Try to use index 0's proof for a different address
      const invalidInput = {
        address: addressToFieldElement(invalidAddress).toString(),
        pathIndices: getMerkleProof(tree, 0).pathIndices,
        siblings: getMerkleProof(tree, 0).siblings,
        root: root.toString()
      };
      
      console.log(`\n🔐 Attempting to generate proof for: ${invalidAddress}`);
      console.log(`   (Using path for index 0 but different address)`);
      
      const { proof: invalidProof, publicSignals: invalidSignals } = 
        await snarkjs.groth16.fullProve(
          invalidInput,
          path.join(__dirname, '../build/merkle_membership_js/merkle_membership.wasm'),
          path.join(__dirname, '../build/merkle_final.zkey')
        );
      
      // This proof should be generated but verification should fail
      const invalidResult = await verifyProof(invalidProof, invalidSignals);
      
      if (!invalidResult) {
        console.log("\n✅ TEST CASE 2 PASSED: Invalid wallet rejected by verifier");
      } else {
        console.log("\n❌ TEST CASE 2 FAILED: Invalid wallet should be rejected");
        process.exit(1);
      }
      
    } catch (error) {
      // Circuit constraint violation - expected behavior
      console.log(`\n✅ TEST CASE 2 PASSED: Circuit rejected invalid witness`);
      console.log(`   Error: ${error.message}`);
    }
    
    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 TEST SUMMARY");
    console.log("=".repeat(60));
    console.log("✅ All tests passed!");
    console.log(`\nMerkle Tree Stats:`);
    console.log(`  - Levels: ${LEVELS}`);
    console.log(`  - Max addresses: ${MAX_LEAVES}`);
    console.log(`  - Current addresses: ${testAddresses.length}`);
    console.log(`  - Root: ${root.toString().substring(0, 20)}...`);
    console.log(`\nGenerated Files:`);
    console.log(`  - circuits/build/proof.json (valid proof)`);
    console.log(`  - circuits/build/public.json (public signals)`);
    console.log(`  - circuits/build/input.json (circuit input)`);
    console.log("\n✨ Ready for smart contract integration!");
    
  } catch (error) {
    console.error("\n❌ Error:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { buildMerkleTree, generateProof, verifyProof };
