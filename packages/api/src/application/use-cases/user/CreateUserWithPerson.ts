import type { IUseCase } from '@sigep/shared'
import { Person } from '~/domain/entities/Person'
import type { IPasswordService } from '~/domain/entities/User'
import { User } from '~/domain/entities/User'
import type { DrizzleUnitOfWork } from '~/infrastructure/persistence/drizzle/DrizzleUnitOfWork'
import type { CreateUserWithPersonDTO, UserResponseDTO } from '../../dto/user'
import { UserMapper } from '../../mappers/UserMapper'

export interface CreateUserWithPersonDeps {
  unitOfWork: DrizzleUnitOfWork
  passwordService: IPasswordService
}

export class CreateUserWithPerson
  implements IUseCase<CreateUserWithPersonDTO, UserResponseDTO>
{
  constructor(private deps: CreateUserWithPersonDeps) {}

  async execute(
    input: CreateUserWithPersonDTO,
    _actorId: string,
  ): Promise<UserResponseDTO> {
    return this.deps.unitOfWork.withTransaction(async (repos) => {
      // Create Person first
      const person = Person.create({
        firstName: input.firstName,
        lastName: input.lastName,
        dni: input.dni,
      })

      // Save person to get the ID
      const savedPerson = await repos.personRepository.save(person)

      // Create User with the person's ID
      const user = User.create({
        name: input.name,
        password: input.password,
        personId: savedPerson.id,
        passwordService: this.deps.passwordService,
      })

      // Save user
      const savedUser = await repos.userRepository.save(user)

      return UserMapper.toDTO(savedUser)
    })
  }
}
