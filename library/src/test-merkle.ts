/**
 * Quick test for MerkleTreeBuilder
 */

import { MerkleTreeBuilder } from './merkle';

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

async function test() {
  console.log('🧪 Testing MerkleTreeBuilder\n');

  const builder = new MerkleTreeBuilder({ levels: 10 });
  
  console.log('1️⃣  Initializing Poseidon...');
  await builder.initialize();
  console.log('   ✅ Initialized\n');

  console.log('2️⃣  Building tree with', TEST_ADDRESSES.length, 'addresses...');
  const tree = await builder.buildTree(TEST_ADDRESSES);
  console.log('   ✅ Tree built');
  console.log('   Root:', tree.root.toString());
  console.log('   Leaves:', tree.leaves.length, '\n');

  console.log('3️⃣  Generating proof for address:', TEST_ADDRESSES[3]);
  const proof = builder.getMerkleProof(TEST_ADDRESSES[3]);
  console.log('   ✅ Proof generated');
  console.log('   Leaf index:', proof.leafIndex);
  console.log('   Path indices:', proof.pathIndices.slice(0, 5), '...');
  console.log('   Siblings count:', proof.siblings.length, '\n');

  console.log('4️⃣  Verifying proof locally...');
  const isValid = builder.verifyProof(proof);
  console.log('   ✅ Proof valid:', isValid, '\n');

  console.log('5️⃣  Tree stats:');
  console.log(builder.getStats(), '\n');

  console.log('✅ All tests passed!');
}

test().catch(console.error);
