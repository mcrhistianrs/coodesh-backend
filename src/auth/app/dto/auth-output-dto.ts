class AuthOutputDTO {
  constructor(
    public id?: string,
    public name?: string,
    public token?: string,
  ) {
    this.id = id;
    this.name = name;
    this.token = token;
  }
}

export { AuthOutputDTO };
