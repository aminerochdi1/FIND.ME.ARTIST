class Subscription {

    price: number
    expireAt: Date

    constructor(price: number, expireAt: Date){
        this.price = price;
        this.expireAt = expireAt;
    }
}

export default Subscription;