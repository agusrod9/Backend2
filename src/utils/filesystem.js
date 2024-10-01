import fs from 'fs';

const productsFile = './lastProductId.txt';
const cartsFile = './lastCartId.txt';


export const incrementLastProductId=()=>{

    if(fs.existsSync(productsFile)){
        let lastProductId = +fs.readFileSync(productsFile, 'utf-8');
        lastProductId++;
        fs.writeFileSync(productsFile,lastProductId.toString());
        return lastProductId;
    }else{
        fs.writeFileSync(productsFile,"1"); 
        return 1;
    }

};

export const incrementLastCartId=()=>{

    if(fs.existsSync(cartsFile)){
        let lastCartId = +fs.readFileSync(cartsFile, 'utf-8');
        lastCartId++;
        fs.writeFileSync(cartsFile,lastCartId.toString());
        return lastCartId;
    }else{
        fs.writeFileSync(cartsFile,"1"); 
        return 1;
    }

};


