export class Profile {
    name: string;
    surname: string;
    gender: string;
    region: string;
    age: number;
    title: string;
    phone: string;
    birthday: {
        dmy: string; // day; month; year
        mdy: string; // month; day; year
        raw: number // UNIX timestamp
    };
    email: string;
    password: string;
    credit_card: {
        expiration: string;
        number: string;
        pin: number;
        security: number
    };
    photo: string;
}
