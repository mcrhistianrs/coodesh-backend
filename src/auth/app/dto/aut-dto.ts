import { ApiProperty } from '@nestjs/swagger';

class AuthDTO {
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: 'strongPassword123' })
  password: string;
}

export { AuthDTO };
