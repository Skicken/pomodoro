import * as bcrypt from 'bcrypt';

export const passwordHash = (password:string):string=>
{
  const saltOrRounds = 10;
  return  bcrypt.hashSync(password,saltOrRounds);
}
export const validPassword = (plain:string,hashed:string) :boolean=>
{
  return bcrypt.compareSync(plain,hashed);
}
