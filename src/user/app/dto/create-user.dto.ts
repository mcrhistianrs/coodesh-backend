import { ApiProperty } from '@nestjs/swagger';

class CreateUserDTO {
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: 'strongPassword123' })
  password: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;
}

export { CreateUserDTO };
