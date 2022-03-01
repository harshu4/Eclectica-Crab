import { Web3Storage } from './web3storage.js'

const client = new Web3Storage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEViOEQ0NDA4QTkwOEVhNkI1Njk4ZmIyZjQ5ZGIzYjM5MGE2MTEzRmUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDMyNjEzNDU4MTIsIm5hbWUiOiJlY2xlY3RpY2EifQ.KB04AQgKdo9Z9gQHc30_hx6BIA-I62-5-3aYlM5lFeY" })

window.uploadW3s = async (file,name) =>{
    const rootCid = await client.put(file, {wrapWithDirectory: true,  name ,  maxRetries: 3})
    return rootCid;
}