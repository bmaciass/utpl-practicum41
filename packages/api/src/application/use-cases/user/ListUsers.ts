import type { IUseCase, PaginationOptions } from '@sigep/shared'
import type {
  IUserRepository,
  UserFilters,
} from '~/domain/repositories/IUserRepository'
import type { UserResponseDTO } from '../../dto/user'
import { UserMapper } from '../../mappers/UserMapper'

export interface ListUsersDTO {
  where?: UserFilters
  pagination?: PaginationOptions
}

export interface ListUsersDeps {
  userRepository: IUserRepository
}

export class ListUsers implements IUseCase<ListUsersDTO, UserResponseDTO[]> {
  constructor(private deps: ListUsersDeps) {}

  async execute(input: ListUsersDTO): Promise<UserResponseDTO[]> {
    const users = await this.deps.userRepository.findMany({
      where: input.where,
      pagination: input.pagination,
    })

    // Load persons for each user
    const results: UserResponseDTO[] = []
    for (const user of users) {
      results.push(UserMapper.toDTO(user))
    }

    return results
  }
}
