/**
 * Full E2E test: Merkle Tree → ZK Proof → Verification
 */

import { MerkleTreeBuilder } from './merkle';
import { ProofGenerator, ProofVerifier } from './prover';

const TEST_ADDRESSES = [
  '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
  '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
  '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db',
  '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB',
  '0x617F2E2fD72FD9D5503197092aC168c91465E7f2',
  '0x17F6AD8Ef982297579C203069C1DbfFE4348c372',
  '0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678',
  '0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7'
];

async function testFullFlow() {
  console.log('🧪 ZKPJWT - Full E2E Test\n');
  console.log('='.repeat(60));

  // Step 1: Build Merkle Tree
  console.log('1️⃣  Building Merkle tree...');
  const merkleBuilder = new MerkleTreeBuilder({ levels: 10 });
  await merkleBuilder.initialize();
  const tree = await merkleBuilder.buildTree(TEST_ADDRESSES);
  console.log('   ✅ Tree built');
  console.log('   Root:', tree.root.toString());
  console.log('');

  // Step 2: Generate Merkle Proof
  const testAddress = TEST_ADDRESSES[3];
  console.log('2️⃣  Generating Merkle proof for:', testAddress);
  const merkleProof = merkleBuilder.getMerkleProof(testAddress);
  console.log('   ✅ Merkle proof generated');
  console.log('   Leaf index:', merkleProof.leafIndex);
  console.log('   Path length:', merkleProof.pathIndices.length);
  console.log('');

  // Step 3: Generate ZK Proof
  console.log('3️⃣  Generating Groth16 ZK proof...');
  const prover = new ProofGenerator();
  await prover.loadArtifacts();
  
  console.log('   ⚙️  Loading circuit artifacts...');
  const zkProof = await prover.generateProof(merkleProof);
  console.log('   ✅ ZK proof generated');
  console.log('   Public signals:', zkProof.publicSignals);
  console.log('   Merkle root from proof:', zkProof.merkleRoot.toString());
  console.log('');

  // Step 4: Verify Proof Client-Side (Full Groth16 Verification)
  console.log('4️⃣  Verifying proof client-side (FULL Groth16)...');
  const verifier = new ProofVerifier();
  await verifier.loadVerificationKey();
  
  const result = await verifier.verifyProof(zkProof);
  console.log('   ✅ Verification result:', result.isValid ? 'VALID ✅' : 'INVALID ❌');
  if (result.error) {
    console.log('   Error:', result.error);
  }
  console.log('');

  // Step 5: Verify root matches
  console.log('5️⃣  Checking root consistency...');
  const rootsMatch = tree.root === zkProof.merkleRoot;
  console.log('   Tree root:', tree.root.toString());
  console.log('   Proof root:', zkProof.merkleRoot.toString());
  console.log('   ✅ Roots match:', rootsMatch);
  console.log('');

  console.log('='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log('✅ Merkle tree construction: OK');
  console.log('✅ Merkle proof generation: OK');
  console.log('✅ Groth16 ZK proof generation: OK');
  console.log(`✅ Client-side verification: ${result.isValid ? 'OK' : 'FAILED'}`);
  console.log(`✅ Root consistency: ${rootsMatch ? 'OK' : 'FAILED'}`);
  console.log('');

  if (result.isValid && rootsMatch) {
    console.log('🎉 All tests passed! Ready for on-chain verification.\n');
    console.log('📋 Next step: Submit to contract with verifyProof(', zkProof.merkleRoot.toString(), ')');
  } else {
    console.log('❌ Tests failed');
    process.exit(1);
  }
}

testFullFlow().catch(error => {
  console.error('\n❌ ERROR:', error.message);
  console.error(error);
  process.exit(1);
});
