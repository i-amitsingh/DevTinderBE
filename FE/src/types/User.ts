export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  age?: number | string;
  gender?: string;
  photoUrl?: string;
  about?: string;
  skills?: string[];
  createdAt?: string;
  updatedAt?: string;
}
