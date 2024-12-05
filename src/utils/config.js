import * as url from 'url';

const config = {
    dirName : url.fileURLToPath(new URL('../', import.meta.url)), 
}


export default config;