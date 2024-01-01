import { Injectable } from '@nestjs/common';
import {getMail} from "./email/IMAP"

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  } 
  
  
  getEmailsFromGmail(username: string,  password: string) : Array<string>{
    const mail = new getMail(username, password);
    let fetchedEmails : Array<string>; 
    mail.execute().then((value) => {
        fetchedEmails=value
    });
    return fetchedEmails;
  }
}
