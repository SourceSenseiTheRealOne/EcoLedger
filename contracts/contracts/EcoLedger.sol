// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/access/Ownable.sol';

/**
 * @title EcoLedger Contract
 * @dev A simplified smart contract for recording verifiable sustainability data on-chain
 * Anyone with a connected wallet can register products directly
 */
contract EcoLedger is Ownable {
    
    // Product structure
    struct Product {
        string productId;
        string name;
        string category;
        uint256 co2Footprint; // in grams
        address company; // Wallet address that registered the product
        uint256 timestamp;
        string txHash; // Transaction hash when product was registered
        bool exists;
    }
    
    // State variables
    mapping(string => Product) public products;
    mapping(address => string[]) public walletProducts; // wallet address => product IDs
    string[] public productIds;
    
    // Events
    event ProductRegistered(
        string indexed productId,
        string name,
        string category,
        uint256 co2Footprint,
        address indexed company,
        uint256 timestamp
    );
    
    event ProductUpdated(
        string indexed productId,
        string name,
        uint256 newCo2Footprint,
        address indexed company
    );
    
    // Constructor
    constructor() Ownable(msg.sender) {}
    
    // Register a product (no company registration required)
    function registerProduct(
        string memory _productId,
        string memory _name,
        string memory _category,
        uint256 _co2Footprint,
        string memory _txHash
    ) public {
        require(bytes(_productId).length > 0, "Product ID cannot be empty");
        require(bytes(_name).length > 0, "Product name cannot be empty");
        require(bytes(_category).length > 0, "Product category cannot be empty");
        require(_co2Footprint > 0, "CO2 footprint must be greater than 0");
        require(bytes(_txHash).length > 0, "Transaction hash cannot be empty");
        require(!products[_productId].exists, "Product ID already exists");
        
        products[_productId] = Product({
            productId: _productId,
            name: _name,
            category: _category,
            co2Footprint: _co2Footprint,
            company: msg.sender, // Use wallet address as company
            timestamp: block.timestamp,
            txHash: _txHash, // Store the transaction hash
            exists: true
        });
        
        productIds.push(_productId);
        walletProducts[msg.sender].push(_productId);
        
        emit ProductRegistered(_productId, _name, _category, _co2Footprint, msg.sender, block.timestamp);
    }
    
    // Update product CO2 footprint (only by the wallet that registered it)
    function updateProductCo2(
        string memory _productId,
        uint256 _newCo2Footprint
    ) public {
        require(products[_productId].exists, "Product does not exist");
        require(products[_productId].company == msg.sender, "Only the registering wallet can update");
        require(_newCo2Footprint > 0, "CO2 footprint must be greater than 0");
        
        products[_productId].co2Footprint = _newCo2Footprint;
        
        emit ProductUpdated(_productId, products[_productId].name, _newCo2Footprint, msg.sender);
    }
    
    // Update product transaction hash (only by the wallet that registered it)
    function updateProductTxHash(
        string memory _productId,
        string memory _txHash
    ) public {
        require(products[_productId].exists, "Product does not exist");
        require(products[_productId].company == msg.sender, "Only the registering wallet can update");
        require(bytes(_txHash).length > 0, "Transaction hash cannot be empty");
        
        products[_productId].txHash = _txHash;
        
        emit ProductUpdated(_productId, products[_productId].name, products[_productId].co2Footprint, msg.sender);
    }
    
    // Get product information
    function getProduct(string memory _productId) public view returns (Product memory) {
        require(products[_productId].exists, "Product does not exist");
        return products[_productId];
    }
    
    // Get all products by wallet address
    function getWalletProducts(address _wallet) public view returns (Product[] memory) {
        string[] memory productIdList = walletProducts[_wallet];
        Product[] memory walletProductList = new Product[](productIdList.length);
        
        for (uint256 i = 0; i < productIdList.length; i++) {
            walletProductList[i] = products[productIdList[i]];
        }
        
        return walletProductList;
    }
    
    // Get all products (for global view)
    function getAllProducts() public view returns (Product[] memory) {
        Product[] memory allProducts = new Product[](productIds.length);
        
        for (uint256 i = 0; i < productIds.length; i++) {
            allProducts[i] = products[productIds[i]];
        }
        
        return allProducts;
    }
    
    // Get total number of products
    function getTotalProducts() public view returns (uint256) {
        return productIds.length;
    }
    
    // Get total CO2 footprint across all products
    function getTotalCo2Footprint() public view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < productIds.length; i++) {
            total += products[productIds[i]].co2Footprint;
        }
        return total;
    }
    
    // Get wallet statistics
    function getWalletStats(address _wallet) public view returns (
        uint256 totalProducts,
        uint256 totalCo2Footprint,
        uint256 averageCo2PerProduct
    ) {
        string[] memory productIdList = walletProducts[_wallet];
        totalProducts = productIdList.length;
        
        for (uint256 i = 0; i < productIdList.length; i++) {
            totalCo2Footprint += products[productIdList[i]].co2Footprint;
        }
        
        averageCo2PerProduct = totalProducts > 0 ? totalCo2Footprint / totalProducts : 0;
    }
    
    // Get global statistics
    function getGlobalStats() public view returns (
        uint256 totalWallets,
        uint256 totalProducts,
        uint256 totalCo2Footprint
    ) {
        totalProducts = productIds.length;
        totalCo2Footprint = getTotalCo2Footprint();
        
        // Count unique wallets
        address[] memory uniqueWallets = new address[](productIds.length);
        uint256 uniqueCount = 0;
        
        for (uint256 i = 0; i < productIds.length; i++) {
            address wallet = products[productIds[i]].company;
            bool isUnique = true;
            
            for (uint256 j = 0; j < uniqueCount; j++) {
                if (uniqueWallets[j] == wallet) {
                    isUnique = false;
                    break;
                }
            }
            
            if (isUnique) {
                uniqueWallets[uniqueCount] = wallet;
                uniqueCount++;
            }
        }
        
        totalWallets = uniqueCount;
    }
    
    // Check if a product exists
    function isProductExists(string memory _productId) public view returns (bool) {
        return products[_productId].exists;
    }
}