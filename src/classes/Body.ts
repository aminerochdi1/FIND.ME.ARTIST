export class Body {

    ethnic: number;
    hair: number;
    eyes: number;
    height: number;
    bust: number;
    hip: number;
    weight: number;
    waist: number;
    shoe: number;
    tattoo: number;
    body_modification: false;

    constructor(body: any){
        this.ethnic = body.ethnic;
        this.hair = body.hair;
        this.eyes = body.eyes;
        this.height = body.height;
        this.bust = body.bust;
        this.hip = body.hip;
        this.weight = body.weight;
        this.tattoo = body.tattoo;
        this.waist = body.waist;
        this.shoe = body.shoe;
        this.body_modification = body.body_modification;
    }
}