import * as url from 'url';

const config = {
    port : 8080,
    dirName : url.fileURLToPath(new URL('.', import.meta.url)),
    mongoURI_local : 'mongodb://localhost:27017/proyectoCoder',
    mongoURI_remote : 'mongodb+srv://agusrod9:QbVL0RIvekZG6DaC@testcluster.g0rcd.mongodb.net/coderProjectBE1'  
}


export default config;