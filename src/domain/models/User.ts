import * as t from 'io-ts'

const User = t.type({
  id: t.string,
  name: t.string
})
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type User = t.TypeOf<typeof User>
export const isUser = User.is
