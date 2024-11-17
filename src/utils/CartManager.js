import fs from 'fs';

export class cartManager{
    constructor(file){
        this.file = file;
    }

    async init(){
        try{
            await fs.promises.access(this.file);
            console.log("cartManager_init - file already exists.")
        }catch(err){
            console.log("cartManager_init - new file is being created.")
            await fs.promises.writeFile(this.file, JSON.stringify([]));
        }
    };

    async readCartsFile(){
        const carts = await fs.promises.readFile(this.file, 'utf-8');
        return JSON.parse(carts);
    }

    async addCart(data){
        const carts = await this.readCartsFile();
        carts.push(data);
        await fs.promises.writeFile(this.file, JSON.stringify(carts));
        console.log("Cart successfully added to file.")
    }

    async getCarts(){
        return await this.readCartsFile();
    }
    
    async replaceCart(cid, data){
        let carts = await this.getCarts();
        let index = carts.findIndex(element => element.id===cid);
        carts.splice(index,1);
        carts.push(data);
        await fs.promises.writeFile(this.file, JSON.stringify(carts));
    };

    


}