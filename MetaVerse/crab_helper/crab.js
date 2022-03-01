function transactioncon(obj) {
    console.log(obj);
}

window.admin_panel = ()=>{
    window.open(`https://crabadmin.b-cdn.net/?ccid=${window.config1.contract}`, '_blank').focus()
}

window.circle_buy = async (nft, amount, signature, url) =>{
    init();
    var mySmartContract = new web3.eth.Contract(myabi, window.config1.contract);
    mySmartContract.methods.redeem(window.ethereum.selectedAddress, [nft, url, amount, signature]).send({ "from": window.ethereum.selectedAddress, "value": amount * 10 ** 17 }).on('transactionHash', function (hash) {
       console.log("transaction"+hash)
    })
    .on('confirmation', function (confirmationNumber, receipt) {
        console.log(confirmationNumber)
    })
    .on('receipt', function (receipt) {
                document.getElementsByClassName("hover_bkgr_fricc")[0].style.display = "block"
                document.querySelector('.hover_bkgr_fricc p').textContent = "Your transaction hash is" + receipt.transactionHash
    })
    .on('error', function (error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
        console.log("error occured in contract")
    });
}
