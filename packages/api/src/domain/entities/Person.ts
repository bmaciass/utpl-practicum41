import { Entity, ValidationError } from '@sigep/shared'

export interface CreatePersonProps {
  firstName: string
  lastName: string
  dni: string
}

export interface PersonProps {
  id: number
  uid: string
  firstName: string
  lastName: string
  dni: string
  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date | null
}

export class Person extends Entity {
  private _id: number
  private _firstName: string
  private _lastName: string
  private _dni: string
  private _deletedAt: Date | null

  private constructor(props: PersonProps) {
    super(props.uid, 0, props.createdAt)
    this._id = props.id
    this._firstName = props.firstName
    this._lastName = props.lastName
    this._dni = props.dni
    this._deletedAt = props.deletedAt
    this.updatedAt = props.updatedAt
  }

  static create(props: CreatePersonProps): Person {
    Person.validateDni(props.dni)
    Person.validateName(props.firstName, 'firstName')
    Person.validateName(props.lastName, 'lastName')

    return new Person({
      id: 0,
      uid: crypto.randomUUID(),
      firstName: props.firstName.trim(),
      lastName: props.lastName.trim(),
      dni: props.dni.trim(),
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: null,
    })
  }

  static reconstitute(props: PersonProps): Person {
    return new Person(props)
  }

  private static validateDni(dni: string): void {
    if (!dni || dni.trim().length < 5) {
      throw new ValidationError(
        'El DNI debe tener al menos 5 caracteres',
        'dni',
      )
    }
  }

  private static validateName(name: string, field: string): void {
    if (!name || name.trim().length < 2) {
      throw new ValidationError(
        `El ${field} debe tener al menos 2 caracteres`,
        field,
      )
    }
  }

  updateName(firstName: string, lastName: string): void {
    Person.validateName(firstName, 'firstName')
    Person.validateName(lastName, 'lastName')
    this._firstName = firstName.trim()
    this._lastName = lastName.trim()
    this.markUpdated(0) // FIXME
  }

  updateDni(dni: string): void {
    Person.validateDni(dni)
    this._dni = dni.trim()
    this.markUpdated(0) // FIXME
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
  get firstName(): string {
    return this._firstName
  }
  get lastName(): string {
    return this._lastName
  }
  get fullName(): string {
    return `${this._firstName} ${this._lastName}`
  }
  get dni(): string {
    return this._dni
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
