import fs from 'fs';
import { incrementLastProductId} from './filesystem.js';

export class ProductManager{
    constructor(file){
        this.file = file;
    };

    async init(){
        try{
            await fs.promises.access(this.file);
            console.log("productManager_init - file already exists.");
        }catch(err){
            console.log("productManager_init - new file is being created.");
            await fs.promises.writeFile(this.file, JSON.stringify([]));
        }

    };

    async readProductsFile(){
        const products = await fs.promises.readFile(this.file, 'utf-8');
        return JSON.parse(products);
    };

    async addProduct(data){
        const products = await this.readProductsFile();
        products.push(data);
        await fs.promises.writeFile(this.file, JSON.stringify(products));
        console.log("Product successfully added to file.");
    };


    async getProducts(){
        return await this.readProductsFile();
    };

    async replaceProduct(pid, data){
        let prods = await this.getProducts();
        let index = prods.findIndex(element => element.id===pid);
        prods.splice(index,1);
        prods.push(data);
        await fs.promises.writeFile(this.file, JSON.stringify(prods));
    };

    //entiendo sería mejor hacer un borrado lógico quiza utilizando la property status de los productos, pero no estoy seguro si es lo que se espera.
    async deleteProduct(product){
        let prods = await this.getProducts();
        let index = prods.findIndex(element => element.id===product.id);
        prods.splice(index,1);
        await fs.promises.writeFile(this.file, JSON.stringify(prods));
    }


}