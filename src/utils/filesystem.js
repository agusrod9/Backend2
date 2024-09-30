import fs from 'fs';

const file = './lastProductId.txt';


export const incrementLastProductId=()=>{

    if(fs.existsSync(file)){
        let lastProductId = +fs.readFileSync(file, 'utf-8');
        lastProductId++;
        fs.writeFileSync(file,lastProductId.toString());
        return lastProductId;
    }else{
        fs.writeFileSync(file,"1"); 
        return 1;
    }

};

/*
export const getLastProductId=()=>{
    if(fs.existsSync(file)){
        return +fs.readFileSync(file, 'utf-8');
    }else{
        return -1;
    }
}
*/
