import { Photo } from "./photo";

export interface User {
    id: number;
    username: string;
    name: string;
    surname: string;
    age: number;
    email: string;
    gender: string;
    created: Date;
    lastActive: Date;
    photoUrl: string;
    city: string;
    password: string;
    country: string;
    interests?: string;
    introduction?: string; 
    department: string;
    title: string;
    phone: string;
    photos?: Photo[];
}
