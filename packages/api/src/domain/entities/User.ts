import { Entity, ValidationError } from '@sigep/shared'

export interface PasswordHash {
  hash: string
  salt: string
}

export interface IPasswordService {
  hashPassword(password: string): PasswordHash
  verifyPassword(password: string, hash: string, salt: string): boolean
}

export interface CreateUserProps {
  name: string
  password: string
  personId: number
  passwordService: IPasswordService
}

export interface UserProps {
  id: number
  uid: string
  name: string
  passwordHash: string
  salt: string
  personId: number
  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
}

export class User extends Entity {
  private _id: number
  private _name: string
  private _passwordHash: string
  private _salt: string
  private _personId: number
  private _deletedAt: Date | null

  private constructor(props: UserProps) {
    super(props.uid, 0, props.createdAt)
    this._id = props.id
    this._name = props.name
    this._passwordHash = props.passwordHash
    this._salt = props.salt
    this._personId = props.personId
    this._deletedAt = props.deletedAt
    this.updatedAt = props.updatedAt
  }

  static create(props: CreateUserProps): User {
    User.validateName(props.name)
    User.validatePassword(props.password)

    const { hash, salt } = props.passwordService.hashPassword(props.password)

    return new User({
      id: 0,
      uid: crypto.randomUUID(),
      name: props.name.trim(),
      passwordHash: hash,
      salt,
      personId: props.personId,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    })
  }

  static reconstitute(props: UserProps): User {
    return new User(props)
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length < 3) {
      throw new ValidationError(
        'El nombre de usuario debe tener al menos 3 caracteres',
        'name',
      )
    }
  }

  private static validatePassword(password: string): void {
    if (!password || password.length < 6) {
      throw new ValidationError(
        'La contraseña debe tener al menos 6 caracteres',
        'password',
      )
    }
  }

  updateName(name: string): void {
    User.validateName(name)
    this._name = name.trim()
    this.markUpdated(0) // FIXME
  }

  updatePassword(password: string, passwordService: IPasswordService): void {
    User.validatePassword(password)
    const { hash, salt } = passwordService.hashPassword(password)
    this._passwordHash = hash
    this._salt = salt
    this.markUpdated(0) // FIXME
  }

  verifyPassword(password: string, passwordService: IPasswordService): boolean {
    return passwordService.verifyPassword(
      password,
      this._passwordHash,
      this._salt,
    )
  }

  deactivate(): void {
    this._deletedAt = new Date()
    this.markUpdated(0) // FIXME
  }

  activate(): void {
    this._deletedAt = null
    this.markUpdated(0) // FIXME
  }

  get id(): number {
    return this._id
  }
  get name(): string {
    return this._name
  }
  get password(): string {
    return this._passwordHash
  }
  get salt(): string {
    return this._salt
  }
  get personId(): number {
    return this._personId
  }
  get active(): boolean {
    return this._deletedAt === null
  }
  get deletedAt(): Date | null {
    return this._deletedAt
  }
  get isNew(): boolean {
    return this._id === 0
  }
}
