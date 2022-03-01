import { NFTStorage } from 'https://cdn.jsdelivr.net/npm/nft.storage@5.2.0/dist/bundle.esm.min.js'
const endpoint = 'https://api.nft.storage' // the default

window.upload_nft=  async function (json_data, nfs_token){
    try{
        console.log(nfs_token)
        const storage = new NFTStorage({ endpoint, 'token': nfs_token })
        const metadata = await storage.store(json_data)
        console.log(metadata)
        return metadata;
    }catch(e){
        console.log(e)
        throw("")
    }
}