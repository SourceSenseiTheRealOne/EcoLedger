// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EcoLedger {
    // Struct to store product information
    struct Product {
        string name;
        string category;
        string description;
        uint256 emissionFactor; // kg CO2 per kg (scaled by 1000 for precision)
        uint256 ecoScore;
        uint256 timestamp;
        address owner;
        bool exists;
    }
    
    // Events for tracking
    event ProductAdded(
        uint256 indexed productId,
        string name,
        string category,
        uint256 emissionFactor,
        uint256 ecoScore,
        address owner
    );
    
    event ProductUpdated(
        uint256 indexed productId,
        string name,
        uint256 ecoScore
    );
    
    // State variables
    mapping(uint256 => Product) public products;
    mapping(address => uint256[]) public userProducts;
    uint256 public productCounter;
    address public owner;
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier productExists(uint256 _productId) {
        require(products[_productId].exists, "Product does not exist");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        productCounter = 0;
    }
    
    /**
     * @dev Add a new product to the ledger
     * @param _name Product name
     * @param _category Product category
     * @param _description Product description
     * @param _emissionFactor Emission factor in kg CO2 per kg (scaled by 1000)
     * @param _ecoScore Calculated eco score (0-100)
     */
    function addProduct(
        string memory _name,
        string memory _category,
        string memory _description,
        uint256 _emissionFactor,
        uint256 _ecoScore
    ) public returns (uint256) {
        require(_ecoScore <= 100, "Eco score must be between 0 and 100");
        require(_emissionFactor > 0, "Emission factor must be positive");
        
        productCounter++;
        uint256 productId = productCounter;
        
        products[productId] = Product({
            name: _name,
            category: _category,
            description: _description,
            emissionFactor: _emissionFactor,
            ecoScore: _ecoScore,
            timestamp: block.timestamp,
            owner: msg.sender,
            exists: true
        });
        
        userProducts[msg.sender].push(productId);
        
        emit ProductAdded(
            productId,
            _name,
            _category,
            _emissionFactor,
            _ecoScore,
            msg.sender
        );
        
        return productId;
    }
    
    /**
     * @dev Get product information
     * @param _productId Product ID
     */
    function getProduct(uint256 _productId) 
        public 
        view 
        productExists(_productId)
        returns (
            string memory,
            string memory,
            string memory,
            uint256,
            uint256,
            uint256,
            address
        ) {
        Product memory product = products[_productId];
        return (
            product.name,
            product.category,
            product.description,
            product.emissionFactor,
            product.ecoScore,
            product.timestamp,
            product.owner
        );
    }
    
    /**
     * @dev Get all products for a user
     * @param _user User address
     */
    function getUserProducts(address _user) public view returns (uint256[] memory) {
        return userProducts[_user];
    }
    
    /**
     * @dev Get total number of products
     */
    function getTotalProducts() public view returns (uint256) {
        return productCounter;
    }
    
    /**
     * @dev Update product eco score (only by owner)
     * @param _productId Product ID
     * @param _newEcoScore New eco score
     */
    function updateEcoScore(uint256 _productId, uint256 _newEcoScore) 
        public 
        productExists(_productId) 
    {
        require(msg.sender == products[_productId].owner, "Only product owner can update");
        require(_newEcoScore <= 100, "Eco score must be between 0 and 100");
        
        products[_productId].ecoScore = _newEcoScore;
        
        emit ProductUpdated(_productId, products[_productId].name, _newEcoScore);
    }
    
    /**
     * @dev Get product statistics
     */
    function getStats() public view returns (uint256, uint256, uint256) {
        uint256 totalProducts = productCounter;
        uint256 totalEmissionFactor = 0;
        uint256 totalEcoScore = 0;
        
        for (uint256 i = 1; i <= productCounter; i++) {
            if (products[i].exists) {
                totalEmissionFactor += products[i].emissionFactor;
                totalEcoScore += products[i].ecoScore;
            }
        }
        
        return (totalProducts, totalEmissionFactor, totalEcoScore);
    }
}
