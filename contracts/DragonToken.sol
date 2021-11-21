//SPDX-License-Identifier: MIT

pragma solidity "0.8.0";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DragonToken is ERC721, Ownable {
    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {}

    uint256 COUNT;
    uint256 fee = 0.01 ether;
    uint256 randNonce = 0;
    uint256 attackVictoryProbability = 70;
    uint256 cooldownTime = 100 seconds;
    uint256 dnaMod = 10**16;

    struct Dragon {
        string name;
        uint256 id;
        uint256 dna;
        uint8 level;
        uint8 rarity;
        uint256 winCount;
        uint256 lossCount;
        uint256 totalBattles;
        uint256 coolDonwnTime;
    }

    Dragon[] public dragons;

    event NewDragon(address indexed owner, uint256 id, uint256 dna);

    //helpers
    function updateFees(uint256 _fee) public onlyOwner {
        fee = _fee;
    }

    function getFee() public view returns (uint256) {
        return fee;
    }

    function _createRandomNumber(uint256 _mod) internal view returns (uint256) {
        uint256 randomNumber;
        randomNumber = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender))
        );
        return randomNumber % _mod;
    }

    function randMod(uint256 _modulus) internal returns (uint256) {
        randNonce = randNonce++;
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.timestamp, msg.sender, randNonce)
                )
            ) % _modulus;
    }

    function withdraw() external payable onlyOwner {
        address payable _owner = payable(owner());
        _owner.transfer(address(this).balance);
    }

    //creator functions
    function _createDragon(string memory _name) internal {
        uint8 randomRarity = uint8(_createRandomNumber(100));
        uint256 randomDNA = uint256(_createRandomNumber(10**16));
        Dragon memory dragon = Dragon(
            _name,
            COUNT,
            randomDNA,
            1,
            randomRarity,
            0,
            0,
            0,
            uint256(block.timestamp + cooldownTime)
        );
        dragons.push(dragon);
        _safeMint(msg.sender, COUNT);
        emit NewDragon(msg.sender, COUNT, randomDNA);
        COUNT++;
    }

    function createRandomDragon(string memory _name) public payable {
        require(msg.value >= fee);
        _createDragon(_name);
    }

    //getters

    function getDragonsOfNotUser(address _owner)
        public
        view
        returns (Dragon[] memory)
    {
        Dragon[] memory notOwnerDragons = new Dragon[](
            COUNT - balanceOf(_owner)
        );
        uint256 i = 0;
        for (uint256 j = 0; j < dragons.length; j++) {
            if (ownerOf(j) != _owner) {
                notOwnerDragons[i] = dragons[j];
                i++;
            }
        }
        return notOwnerDragons;
    }

    function getDragonById(uint256 _id) public view returns (Dragon memory) {
        require(_id < COUNT);
        return dragons[_id];
    }

    function getDragons() public view returns (Dragon[] memory) {
        return dragons;
    }

    function getOwnerDragons(address _owner)
        public
        view
        returns (Dragon[] memory)
    {
        Dragon[] memory ownerDragons = new Dragon[](balanceOf(_owner));
        uint256 i = 0;
        for (uint256 j = 0; j < dragons.length; j++) {
            if (ownerOf(j) == _owner) {
                ownerDragons[i] = dragons[j];
                i++;
            }
        }
        return ownerDragons;
    }

    //modifiers
    modifier onlyOwnerOf(uint256 _id) {
        require(ownerOf(_id) == msg.sender);
        _;
    }

    //Game Logics
    function _triggerCooldown(Dragon storage _dragon) internal {
        _dragon.coolDonwnTime = uint32(block.timestamp + cooldownTime);
    }

    function _isReady(Dragon storage _dragon) internal view returns (bool) {
        return _dragon.coolDonwnTime <= uint32(block.timestamp);
    }

    function evolveDragon(uint256 _dragonId, uint256 _targetDna) internal {
        Dragon storage dragon = dragons[_dragonId];
        _targetDna = _targetDna % dnaMod;
        uint256 newDna = (dragon.dna + _targetDna) / 2;
        dragon.dna = newDna;
    }

    function levelUp(uint256 _id) public {
        require(ownerOf(_id) == msg.sender);
        Dragon storage dragon = dragons[_id];
        dragon.level++;
    }

    function fight(uint256 _attackerId, uint256 _defenderId) public {
        Dragon storage attacker = dragons[_attackerId];
        Dragon storage defender = dragons[_defenderId];
        uint256 rand = randMod(100);
        if (rand <= attackVictoryProbability) {
            attacker.winCount++;
            defender.lossCount++;
            attacker.level++;
            attacker.totalBattles++;
            defender.totalBattles++;
            evolveDragon(attacker.id, defender.dna);
        } else {
            attacker.lossCount++;
            defender.winCount++;
            attacker.totalBattles++;
            defender.totalBattles++;
            evolveDragon(defender.id, attacker.dna);
        }
    }
}
