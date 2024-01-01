import { Controller, Get } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Controller('email')
export class EmailController {
    constructor(private appService: AppService) {}
    
    @Get()
    findAll(): Array<string> {
        return this.appService.getEmailsFromGmail("djessy.engo47@gmail.com","<3AS,Wild<3");
  }
}
