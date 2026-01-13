import type { Role } from '~/domain/entities/Role'

export interface GetRoleForUserDTO {
  roles: Role[]
}
