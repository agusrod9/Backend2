import * as url from 'url';

const config = {
    port : 8080,
    dirName : url.fileURLToPath(new URL('.', import.meta.url))
}


export default config;