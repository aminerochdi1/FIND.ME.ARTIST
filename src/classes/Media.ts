export class Media {

    id: number;
    reference_id: number|undefined;
    path: string;
    createdAt: Date;

    constructor(id: number, path: string, createdAt: Date, reference_id?: number) {
        this.reference_id = reference_id;
        this.id = id;
        this.path = path;
        this.createdAt = createdAt;
    }
}