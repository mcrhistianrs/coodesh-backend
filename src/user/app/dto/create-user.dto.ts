class CreateUserDTO {
  constructor(
    public email: string,
    public password: string,
    public name: string,
  ) {}
}

export { CreateUserDTO };
