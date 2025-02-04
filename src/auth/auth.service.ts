import { Injectable } from '@nestjs/common';
import { ResponseDto } from 'src/user/dto/reponse';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private userService:UserService){}
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.userService.findOneByEmail(username);
        if(user){
            const isValid =  await this.userService.isValidUserpassword(pass,user.password)
            if(isValid === true){
                return new ResponseDto(200, 'Is valid password', user);
            }
        }else{
            return new ResponseDto(400, 'user does not already exists', null);

        }
        if (user && user.password === pass) {
          const { password, ...result } = user;
          return result;
        }
        return null;
      }
}
