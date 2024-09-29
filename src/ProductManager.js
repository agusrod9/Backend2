import fs from 'fs';

export class ProductManager{
    constructor(file){
        this.file = file;
    }

    async init(){
        try{
            const exists = await fs.promises.access(this.file);
            console.log("productManager_init - file already exists.")
        }catch(err){
            console.log("productManager_init - new file is being created.")
            await fs.promises.writeFile(this.file, JSON.stringify([]));
        }
    }

    async readProductsFile(){
        const products = await fs.promises.readFile(this.file, 'utf-8');
        return JSON.parse(products);
    }

    async addProduct(data){
        const products = await this.readProductsFile();
        products.push(data);

        await fs.promises.writeFile(this.file.JSON.stringify(products));
        console.log("Product successfully added to file.")
    }


    async getProducts(){
        return await this.readProductsFile();
    }

    /*
    async getProducts(limit){
        return await this.readProductsFile().slice(0,limit);
    }
*/

}