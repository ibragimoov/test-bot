export class CreateUserDto {
  readonly chatId: number;
  readonly phone: string;
  readonly username: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly city: string;
}
