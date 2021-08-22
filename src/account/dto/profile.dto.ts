import { tsTsxJsJsxRegex } from 'ts-loader/dist/constants';

export class ProfileDto {
  constructor( email: string, name: string, studentId: number, phone: string, birth: string, sex: string, stringTags: string[]) {
    this.email = email;
    this.name = name;
    this.student_id = studentId;
    this.phone = phone;
    this.birth = birth;
    this.sex = sex;
    this.tags = stringTags;
  }

  email: string;
  name: string;
  student_id: number;
  phone: string;
  birth: string;
  sex: string;
  ckeckNotice: boolean;
  tags: string[];
}
