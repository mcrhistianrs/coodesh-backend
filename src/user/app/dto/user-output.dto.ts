class UserOutputDTO {
  constructor(
    public id: string,
    public email: string,
    public name: string,
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
  }
}

export { UserOutputDTO };
