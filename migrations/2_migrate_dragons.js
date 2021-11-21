const DragonToken = artifacts.require("DragonToken");

module.exports = function (deployer) {
    deployer.deploy(DragonToken, "Dragon", "DGN");
};
