const { getWeth, AMOUNT } = require("../scripts/getWeth")
const { ethers } = require("hardhat")

async function main() {
    //nap tien vao deployer
    await getWeth()
    // get deployer
    const [deployer] = await ethers.getSigners();

    //get pool address
    const pool = await getPool(deployer)
    console.log(`Pool address ${pool.target}`)
    const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    
    // approve and deposit
    await approveErc20(wethTokenAddress,pool.target,AMOUNT,deployer)
    console.log("Depositing....")
    await pool.deposit(wethTokenAddress, AMOUNT, deployer, 0)
    console.log("deposited")

    // // get available borrow
    let { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(pool, deployer)
    const daiPrice = await getDaiPrice()
    const amountDaiToBorrow = availableBorrowsETH.toString() * 0.95 * (1 / Number(daiPrice))
    const amountDaiToBorrowWei = ethers.parseEther(amountDaiToBorrow.toString())
    console.log(`You can borrow ${amountDaiToBorrow.toString()} DAI`)

    //borrow
    const DaiTokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    await borrowDai(DaiTokenAddress,pool,amountDaiToBorrowWei,deployer)

    // get available borrow after borrow
    await getBorrowUserData(pool,deployer)

    await repay(
        amountDaiToBorrowWei,
        DaiTokenAddress,
        pool,
        deployer
    )
    await getBorrowUserData(pool, deployer)
}

async function repay(amount, daiAddress, pool, account) {
await approveErc20(daiAddress, pool.target, amount, account)
const repayTx = await pool.repay(daiAddress, amount, 2, account)
await repayTx.wait(1)
console.log("Repaid!")
}

async function getDaiPrice() {
    const daiEthPriceFeed = await ethers.getContractAt(
        "AggregatorV3Interface",
        // networkConfig[network.config.chainId].daiEthPriceFeed
        "0x773616E4d11A78F511299002da57A0a94577F1f4"
    )
    const price = (await daiEthPriceFeed.latestRoundData())[1]
    console.log(`The DAI/ETH price is ${price.toString()}`)
    return price
}

async function borrowDai(daiAddress, pool, amountDaiToBorrow, account) {
    const borrowTx = await pool.borrow(daiAddress, amountDaiToBorrow, 2, 0, account)
    await borrowTx.wait(1)
    console.log("You've borrowed!")
}

async function getPool(account) {
    const poolAddressProvider = await ethers.getContractAt("ILendingPoolAddressesProvider", "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5", account)
    const poolAdderss = await poolAddressProvider.getLendingPool()
    const pool = await ethers.getContractAt("ILendingPool", poolAdderss, account)
    return pool
}

async function approveErc20(erc20Address, spenderAddress, amount, signer) {
    console.log(`${AMOUNT}`)
    const erc20Token = await ethers.getContractAt("IERC20", erc20Address, signer)
    txResponse = await erc20Token.approve(spenderAddress, amount)
    await txResponse.wait(1)
    console.log("Approved!")
}

async function getBorrowUserData(pool, account) {
    const {
        totalCollateralETH,
        totalDebtETH,
        availableBorrowsETH,
    } = await pool.getUserAccountData(account)
    console.log(`Your totalCollateralBase ${totalCollateralETH} worth of ETH deposited.`)
    console.log(`Your totalDebtBase ${totalDebtETH} worth of ETH borrowed.`)
    console.log(`Your availableBorrowsBase ${availableBorrowsETH} worth of ETH.`)
    return { availableBorrowsETH, totalDebtETH }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

// 4.4208000000
//
