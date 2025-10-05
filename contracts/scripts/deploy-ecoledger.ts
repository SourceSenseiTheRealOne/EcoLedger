import { ethers, network } from 'hardhat';

async function main() {
  console.log("🚀 Deploying EcoLedger Contract to VeChain Testnet...");
  console.log("=" .repeat(60));

  // Get the contract factory
  const EcoLedger = await ethers.getContractFactory("EcoLedger");

  console.log("📋 Contract Features:");
  console.log("   ✅ No company registration required");
  console.log("   ✅ Direct product registration");
  console.log("   ✅ Wallet address as company identifier");
  console.log("   ✅ getWalletProducts() function");
  console.log("   ✅ Simplified user experience");
  console.log("");

  // Deploy the contract
  console.log("⏳ Deploying contract...");
  const ecoLedger = await EcoLedger.deploy();

  // Wait for deployment to complete
  console.log("⏳ Waiting for deployment confirmation...");
  await ecoLedger.waitForDeployment();

  const contractAddress = await ecoLedger.getAddress();
  
  console.log("✅ EcoLedger deployed successfully!");
  console.log("=" .repeat(60));
  console.log("📍 Contract Address:", contractAddress);
  console.log("🌐 Network: VeChain Testnet");
  console.log("🔗 Explorer: https://explore-testnet.vechain.org/accounts/" + contractAddress);
  console.log("");

  // Save deployment info
  const deploymentInfo = {
    contractName: "EcoLedger",
    contractAddress: contractAddress,
    network: "vechain_testnet",
    deploymentTime: new Date().toISOString(),
    features: [
      "No company registration required",
      "Direct product registration",
      "Wallet address as company identifier", 
      "getWalletProducts() function",
      "Simplified user experience"
    ],
    functions: [
      "registerProduct(productId, name, category, co2Footprint)",
      "getWalletProducts(walletAddress)",
      "getWalletStats(walletAddress)",
      "getGlobalStats()",
      "updateProductCo2(productId, newCo2Footprint)",
      "getProduct(productId)",
      "getAllProducts()"
    ]
  };

  console.log("📄 Deployment Information:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  console.log("");

  // Test basic functionality
  console.log("🧪 Testing basic functionality...");
  try {
    const totalProducts = await ecoLedger.getTotalProducts();
    const globalStats = await ecoLedger.getGlobalStats();
    
    console.log("✅ Contract is working correctly!");
    console.log("   📊 Total Products:", totalProducts.toString());
    console.log("   👥 Total Wallets:", globalStats[0].toString());
    console.log("   🌱 Total CO2 Footprint:", globalStats[2].toString(), "grams");
  } catch (error) {
    console.log("⚠️  Warning: Could not test contract functionality:", error);
  }

  console.log("");
  console.log("🎉 Deployment completed successfully!");
  console.log("💡 Next steps:");
  console.log("   1. Update frontend contract address");
  console.log("   2. Test product registration");
  console.log("   3. Verify contract on explorer");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
