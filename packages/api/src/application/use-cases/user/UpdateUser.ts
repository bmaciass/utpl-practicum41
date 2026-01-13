import type { IUseCase } from '@sigep/shared'
import type { IPasswordService } from '~/domain/entities/User'
import type { DrizzleUnitOfWork } from '~/infrastructure/persistence/drizzle/DrizzleUnitOfWork'
import type { UpdateUserDTO, UserResponseDTO } from '../../dto/user'
import { UserMapper } from '../../mappers/UserMapper'

export interface UpdateUserDeps {
  unitOfWork: DrizzleUnitOfWork
  passwordService: IPasswordService
}

export class UpdateUser implements IUseCase<UpdateUserDTO, UserResponseDTO> {
  constructor(private deps: UpdateUserDeps) {}

  async execute(
    input: UpdateUserDTO,
    _actorId: string,
  ): Promise<UserResponseDTO> {
    return this.deps.unitOfWork.withTransaction(async (repos) => {
      // Get user
      const user = await repos.userRepository.findByUidOrThrow(input.uid)

      // Update user fields
      if (input.name !== undefined) {
        user.updateName(input.name)
      }

      if (input.password !== undefined) {
        user.updatePassword(input.password, this.deps.passwordService)
      }

      if (input.active !== undefined) {
        if (input.active) {
          user.activate()
        } else {
          user.deactivate()
        }
      }

      // Save user
      const savedUser = await repos.userRepository.save(user)

      // Get and update person if needed
      const person = await repos.personRepository.findById(savedUser.personId)

      if (
        person &&
        (input.firstName !== undefined ||
          input.lastName !== undefined ||
          input.dni !== undefined)
      ) {
        if (input.firstName !== undefined || input.lastName !== undefined) {
          person.updateName(
            input.firstName ?? person.firstName,
            input.lastName ?? person.lastName,
          )
        }

        if (input.dni !== undefined) {
          person.updateDni(input.dni)
        }

        if (input.active !== undefined) {
          if (input.active) {
            person.activate()
          } else {
            person.deactivate()
          }
        }

        await repos.personRepository.save(person)
      }

      return UserMapper.toDTO(savedUser)
    })
  }
}
