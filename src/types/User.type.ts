import { nanoid } from 'nanoid';

export class UserType {
    id: string;
    name: string;

    constructor(name: string, id?: string) {
        this.name = name;
        this.id = id || nanoid();
    }
}
