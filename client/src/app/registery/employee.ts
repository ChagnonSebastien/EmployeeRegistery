export class Employee {
    public firstName: string;
    public lastName: string;
    public employeeType: Number;
    public email: string;

    public adress: string;
    public postalCode: string;
    public city: string;
    public province: string;
    public country: string;

    public homePhone: string;
    public cellPhone: string;

    public birthDate: string;
    public hiringDate: string;

    public nas: string;
    public fullTimeStudent: boolean;

    public active: boolean;
    public canEdit: boolean;

    public constructor(public _id: Number) {
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.adress = '';
        this.postalCode = '';
        this.city = '';
        this.province = '';
        this.country = '';
        this.homePhone = '';
        this.cellPhone = '';
        this.birthDate = '';
        this.hiringDate = '';
        this.nas = '';
        this.fullTimeStudent = true;
        this.active = true;
        this.canEdit = true;
    }
}
