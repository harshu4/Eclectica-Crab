let template = {
    "genesis":['index.html']
}

let loc =window.location.href;
let repo = 'hackathonmeta'


async function deployMetaVerse(dtype, tid,title,symbol,uri,host_addr,contract_addr,ns_token){
    let fetch_url = loc+"/"+repo+"/"+tid+"/index.html";
    let cidV1 = "";
    if(dtype=="ipfs"){
        await storeFiles(fetch_url,'/'+title+'/index.html');
        await storeJson(title,symbol,uri,host_addr,contract_addr, ns_token);
        let rootCid = (await getDir('/'+title)).cid;
        let cids = [rootCid.toString(), rootCid.toV1().toString()];
        cidV1= cids[1]; 
    }else{
        let a = `window.config1 = {"title":"${title}","symbol":"${symbol}","host":"${host_addr}","contract":"${contract_addr}","symbol":"${symbol}","uri":"${uri}","nft_tokent_enc":"${ns_token}"};`;
        const config_blob = new Blob([a], {type : 'text/javascript'})
        let r = await fetch(fetch_url)
        const files = [new File([await r.text()], 'index.html'), new File([config_blob], 'config.js')]
        cidV1 = await window.uploadW3s(files,title)
    }
    return cidV1;
}

async function hostMetaverse(tid,title){
    for(let path of template[tid]){
        try{
            let fetch_url = loc+"/"+repo+"/"+path;
            path='/'+title+'/'+path;
            await storeFiles(fetch_url,path)
        }catch(e){
            console.log(e)
            throw("")
        }
    }
    console.log("Metaverse Done!")
}