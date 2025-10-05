import { expect } from "chai";
import { ethers } from "hardhat";

describe("EcoLedger Contract", function () {
  let ecoLedger: any;
  let owner: any;
  let wallet1: any;
  let wallet2: any;

  beforeEach(async function () {
    [owner, wallet1, wallet2] = await ethers.getSigners();
    
    const EcoLedger = await ethers.getContractFactory("EcoLedger");
    ecoLedger = await EcoLedger.deploy();
    await ecoLedger.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await ecoLedger.getAddress()).to.be.properAddress;
    });

    it("Should set the correct owner", async function () {
      expect(await ecoLedger.owner()).to.equal(owner.address);
    });
  });

  describe("Product Registration", function () {
    it("Should allow any wallet to register a product directly", async function () {
      const productId = "PROD-001";
      const name = "Eco Product";
      const category = "electronics";
      const co2Footprint = 1000; // grams

      await ecoLedger.connect(wallet1).registerProduct(
        productId,
        name,
        category,
        co2Footprint
      );

      const product = await ecoLedger.getProduct(productId);
      expect(product.productId).to.equal(productId);
      expect(product.name).to.equal(name);
      expect(product.category).to.equal(category);
      expect(product.co2Footprint).to.equal(co2Footprint);
      expect(product.company).to.equal(wallet1.address);
      expect(product.exists).to.be.true;
    });

    it("Should not require company registration", async function () {
      // This should work without any company registration
      const productId = "PROD-002";
      const name = "Another Product";
      const category = "clothing";
      const co2Footprint = 500;

      await expect(
        ecoLedger.connect(wallet2).registerProduct(
          productId,
          name,
          category,
          co2Footprint
        )
      ).to.not.be.reverted;

      const product = await ecoLedger.getProduct(productId);
      expect(product.company).to.equal(wallet2.address);
    });

    it("Should prevent duplicate product IDs", async function () {
      const productId = "PROD-003";
      const name = "Duplicate Product";
      const category = "test";
      const co2Footprint = 100;

      // First registration should succeed
      await ecoLedger.connect(wallet1).registerProduct(
        productId,
        name,
        category,
        co2Footprint
      );

      // Second registration with same ID should fail
      await expect(
        ecoLedger.connect(wallet2).registerProduct(
          productId,
          "Different Name",
          "different",
          200
        )
      ).to.be.revertedWith("Product ID already exists");
    });

    it("Should validate input parameters", async function () {
      await expect(
        ecoLedger.connect(wallet1).registerProduct("", "Name", "category", 100)
      ).to.be.revertedWith("Product ID cannot be empty");

      await expect(
        ecoLedger.connect(wallet1).registerProduct("ID", "", "category", 100)
      ).to.be.revertedWith("Product name cannot be empty");

      await expect(
        ecoLedger.connect(wallet1).registerProduct("ID", "Name", "", 100)
      ).to.be.revertedWith("Product category cannot be empty");

      await expect(
        ecoLedger.connect(wallet1).registerProduct("ID", "Name", "category", 0)
      ).to.be.revertedWith("CO2 footprint must be greater than 0");
    });
  });

  describe("Wallet Products", function () {
    it("Should return products for a specific wallet", async function () {
      // Register products for wallet1
      await ecoLedger.connect(wallet1).registerProduct(
        "PROD-001",
        "Product 1",
        "category1",
        100
      );
      
      await ecoLedger.connect(wallet1).registerProduct(
        "PROD-002", 
        "Product 2",
        "category2",
        200
      );

      // Register product for wallet2
      await ecoLedger.connect(wallet2).registerProduct(
        "PROD-003",
        "Product 3", 
        "category3",
        300
      );

      // Get products for wallet1
      const wallet1Products = await ecoLedger.getWalletProducts(wallet1.address);
      expect(wallet1Products).to.have.length(2);
      expect(wallet1Products[0].productId).to.equal("PROD-001");
      expect(wallet1Products[1].productId).to.equal("PROD-002");

      // Get products for wallet2
      const wallet2Products = await ecoLedger.getWalletProducts(wallet2.address);
      expect(wallet2Products).to.have.length(1);
      expect(wallet2Products[0].productId).to.equal("PROD-003");
    });

    it("Should return empty array for wallet with no products", async function () {
      const emptyWalletProducts = await ecoLedger.getWalletProducts(wallet1.address);
      expect(emptyWalletProducts).to.have.length(0);
    });
  });

  describe("Product Updates", function () {
    it("Should allow only the registering wallet to update product", async function () {
      const productId = "PROD-004";
      const name = "Updatable Product";
      const category = "test";
      const co2Footprint = 100;

      // Register product with wallet1
      await ecoLedger.connect(wallet1).registerProduct(
        productId,
        name,
        category,
        co2Footprint
      );

      // wallet1 should be able to update
      await ecoLedger.connect(wallet1).updateProductCo2(productId, 200);
      
      const updatedProduct = await ecoLedger.getProduct(productId);
      expect(updatedProduct.co2Footprint).to.equal(200);

      // wallet2 should not be able to update
      await expect(
        ecoLedger.connect(wallet2).updateProductCo2(productId, 300)
      ).to.be.revertedWith("Only the registering wallet can update");
    });

    it("Should validate update parameters", async function () {
      const productId = "PROD-005";
      
      await ecoLedger.connect(wallet1).registerProduct(productId, "Name", "category", 100);

      await expect(
        ecoLedger.connect(wallet1).updateProductCo2("NONEXISTENT", 200)
      ).to.be.revertedWith("Product does not exist");

      await expect(
        ecoLedger.connect(wallet1).updateProductCo2(productId, 0)
      ).to.be.revertedWith("CO2 footprint must be greater than 0");
    });
  });

  describe("Global Statistics", function () {
    it("Should track unique wallets and total products", async function () {
      // Register products from different wallets
      await ecoLedger.connect(wallet1).registerProduct("PROD-001", "Product 1", "cat1", 100);
      await ecoLedger.connect(wallet1).registerProduct("PROD-002", "Product 2", "cat2", 200);
      await ecoLedger.connect(wallet2).registerProduct("PROD-003", "Product 3", "cat3", 300);

      const stats = await ecoLedger.getGlobalStats();
      expect(stats.totalWallets).to.equal(2); // wallet1 and wallet2
      expect(stats.totalProducts).to.equal(3);
      expect(stats.totalCo2Footprint).to.equal(600); // 100 + 200 + 300
    });

    it("Should return zero stats for empty contract", async function () {
      const stats = await ecoLedger.getGlobalStats();
      expect(stats.totalWallets).to.equal(0);
      expect(stats.totalProducts).to.equal(0);
      expect(stats.totalCo2Footprint).to.equal(0);
    });
  });

  describe("Wallet Statistics", function () {
    it("Should return correct stats for a wallet", async function () {
      await ecoLedger.connect(wallet1).registerProduct("PROD-001", "Product 1", "cat1", 100);
      await ecoLedger.connect(wallet1).registerProduct("PROD-002", "Product 2", "cat2", 200);

      const stats = await ecoLedger.getWalletStats(wallet1.address);
      expect(stats.totalProducts).to.equal(2);
      expect(stats.totalCo2Footprint).to.equal(300);
      expect(stats.averageCo2PerProduct).to.equal(150);
    });

    it("Should return zero stats for wallet with no products", async function () {
      const stats = await ecoLedger.getWalletStats(wallet1.address);
      expect(stats.totalProducts).to.equal(0);
      expect(stats.totalCo2Footprint).to.equal(0);
      expect(stats.averageCo2PerProduct).to.equal(0);
    });
  });

  describe("Product Existence", function () {
    it("Should correctly check if product exists", async function () {
      const productId = "PROD-001";
      
      expect(await ecoLedger.isProductExists(productId)).to.be.false;
      
      await ecoLedger.connect(wallet1).registerProduct(productId, "Name", "category", 100);
      
      expect(await ecoLedger.isProductExists(productId)).to.be.true;
    });
  });

  describe("Events", function () {
    it("Should emit ProductRegistered event", async function () {
      const productId = "PROD-001";
      const name = "Test Product";
      const category = "test";
      const co2Footprint = 100;

      const tx = await ecoLedger.connect(wallet1).registerProduct(productId, name, category, co2Footprint);
      const receipt = await tx.wait();
      
      expect(receipt).to.not.be.null;
      const event = receipt.logs.find(log => {
        try {
          const parsed = ecoLedger.interface.parseLog(log);
          return parsed.name === "ProductRegistered";
        } catch {
          return false;
        }
      });
      expect(event).to.not.be.undefined;
    });

    it("Should emit ProductUpdated event", async function () {
      const productId = "PROD-002";
      
      await ecoLedger.connect(wallet1).registerProduct(productId, "Name", "category", 100);
      
      await expect(
        ecoLedger.connect(wallet1).updateProductCo2(productId, 200)
      ).to.emit(ecoLedger, "ProductUpdated")
        .withArgs(productId, "Name", 200, wallet1.address);
    });
  });
});