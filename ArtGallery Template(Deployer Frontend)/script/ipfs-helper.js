
const IPFS_CLIENT = window.IpfsHttpClient;
let ipfsNode = null;


async function initIpfsPinService(addr,headers){
    if(headers!=null){
        ipfsNode = IPFS_CLIENT.create({'url':addr,'headers':headers})
    }else{
        ipfsNode = IPFS_CLIENT.create(addr)
    }
}

async function storeJson(title,symbol,uri,host,cotract_addr, nft_tokent_enc){
    try{
        let a= `window.config1 = {"title":"${title}","symbol":"${symbol}","host":"${host}","contract":"${cotract_addr}","symbol":"${symbol}","uri":"${uri}","nft_tokent_enc":"${nft_tokent_enc}"};`;
        //a+= ` window.config = {"title":"${title}","symbol":"${symbol}","host":"${host}","contract":"${cotract_addr}","symbol":"${symbol}","uri":"${uri}","nft_tokent_enc":"${nft_tokent_enc}"};`;
        await ipfsNode.files.write(`/${title}/config.js`, new TextEncoder().encode(a), { parents : true, create: true});
    }catch(e){
        console.log(e)
        throw("")
    }
}

async function storeFiles(url,path){
    try{        
        let r = await fetch(url)
        let blob_data = await r.blob();
        await ipfsNode.files.write(path, blob_data, { parents : true, create: true})
    }catch(e){
        console.log(e)
        throw("")
        
    }
}

async function getDir(path){
    try{
        const stats = await ipfsNode.files.stat(path);
        return stats;
    }catch(e){
        console.log(e)
        throw("")
    }
}

