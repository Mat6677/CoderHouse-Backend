import fs from "node:fs"

export class ProductManager {
  constructor(path) {
    this.path = path;
  }

  productVerifictions(product) {
    if (!product.hasOwnProperty("title") || typeof product.title !== "string" || product.title.length < 1) {
      throw new Error('The "title" property must exist, be of type string and have more than 1 character length.');
    }
    if (
      !product.hasOwnProperty("description") ||
      typeof product.description !== "string"
    ) {
      throw new Error(
        'The "description" property must exist and be of type string.'
      );
    }

    if (!product.hasOwnProperty("price") || typeof product.price !== "number") {
      throw new Error('The "price" property must exist and be of type number.');
    }

    if (
      !product.hasOwnProperty("thumbnail") ||
      typeof product.thumbnail !== "string"
    ) {
      throw new Error(
        'The "thumbnail" property must exist and be of type string.'
      );
    }

    if (!product.hasOwnProperty("code") || typeof product.code !== "string") {
      throw new Error('The "code" property must exist and be of type string.');
    }

    if (!product.hasOwnProperty("stock") || typeof product.stock !== "number") {
      throw new Error('The "stock" property must exist and be of type number.');
    }
  }
  async getProducts() {
    if (!fs.existsSync(this.path)) {
      await fs.promises.writeFile(this.path, "[]");
    }

    let data = await fs.promises.readFile(this.path, "utf-8");
    let products = JSON.parse(data);
    return products;
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const product = products.find((p) => p.id == id);
    if (product) {
      return product;
    } else {
      return false
    }
  }

  async addProduct(product) {
    const products = await this.getProducts();
    if (products.find((p) => p.title === product.title)) {
      throw new Error(
        "The product has already been added or is missing the title"
      );
    }
    this.productVerifictions(product);
    const id =
      products.length === 0 ? 0 : Math.max(...products.map((p) => p.id));

    products.push({ ...product, id: id + 1 });

    await fs.promises.writeFile(this.path, JSON.stringify(products));
  }

  async updateProduct(id, updatedProduct) {
    const products = await this.getProducts();
    const oldProduct = products.find((p) => p.id === id);
    const indexOfProduct = products.indexOf(oldProduct);
    products[indexOfProduct] = { ...oldProduct, ...updatedProduct };

    await fs.promises.writeFile(this.path, JSON.stringify(products));
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const product = products.find((p) => p.id == id);
    if (!product) {
      throw Error;
    }
    const updatedProducts = products.filter((p) => p != product);

    await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts));
  }
}

const productManager = new ProductManager("./Products.json");