import {
  Body,
  Controller,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user';
import { ChangePasswordDTO } from 'src/dtos/change-password';
import { ChangePasswordByAdminDTO } from 'src/dtos/change-password-by-admin';
import { SigninDto } from 'src/dtos/signin';
import { SignupPatientDto } from 'src/dtos/signup-patient';
import { UserEntity } from 'src/entities/user';
import { UserType } from 'src/entities/user-type';
import { AccessTokenGuard } from 'src/guards/access-token';
import { RoleCheckerGuard } from 'src/guards/role-checker';
import { AuthService } from 'src/services/auth';

@Controller('/auth')
export class AuthController {
  constructor(@Inject() private readonly authService: AuthService) {}

  @Post('/patient/signup')
  signupPatient(@Body() dto: SignupPatientDto) {
    return this.authService.signupPatient(dto);
  }

  @Post('/signin')
  signIn(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('change-password')
  changePassword(
    @Body() dto: ChangePasswordDTO,
    @CurrentUser() currentUser: UserEntity,
  ) {
    return this.authService.changePassword(dto, currentUser);
  }

  @UseGuards(AccessTokenGuard, RoleCheckerGuard)
  @Patch('/admin/change-password/:id')
  @SetMetadata('user-type', UserType.Admin)
  changePasswordByAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangePasswordByAdminDTO,
  ) {
    return this.authService.changePasswordByAdmin(id, dto);
  }
}
