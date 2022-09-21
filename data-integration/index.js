/**
 * -> Enriquecimento de dados
 *  1. Ler em um banco
 *  2. Bater em uma API para pegar o resto das informações
 *  3. Submeter os dados para outra API
 */

import axios from "axios"

const myDB = async () => Array.from({ length: 1000 }, (key, index) => `${index}-cellphone`)

const PRODUCTS_URL = 'http://localhost:3000/products'
const CART_URL = 'http://localhost:4000/cart'

async function processDbData() {
    const products = await myDB()

    const responses = []
    for(const product of products) {
        const { data: productInfo } = await axios.get(`${PRODUCTS_URL}?productName=${product}`)
        const { data: cartData } = await axios.post(CART_URL, productInfo)

        responses.push(cartData)

        // console.log('productInfo: ', productInfo);
        // console.log('cartInfo: ', cartData);
    }

    return responses
}

// console.table(await processDbData())

async function* processDbDataGenerator() {
    const products = await myDB()

    for(const product of products) {
        const { data: productInfo } = await axios.get(`${PRODUCTS_URL}?productName=${product}`)
        const { data: cartData } = await axios.post(CART_URL, productInfo)

        yield cartData

    }
}

for await (const data of processDbDataGenerator()) {
    console.table(data);
}