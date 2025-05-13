class UserFindAllDTO {
  email?: string;

  constructor(partial: Partial<UserFindAllDTO>) {
    Object.assign(this, partial);
  }
}

export { UserFindAllDTO };
