import { Entity, ValidationError } from '@sigep/shared'
import type { Permission } from './Permission'

export interface CreateRoleProps {
  name: string
  createdBy: number
}

export interface RoleProps {
  id: number
  uid: string
  name: string
  permissions: Permission[]
  createdAt: Date
  createdBy: number
  updatedAt: Date | null
  updatedBy: number | null
  deletedAt: Date | null
}

export class Role extends Entity {
  private _id: number
  private _name: string
  private _permissions: Permission[]
  private _deletedAt: Date | null

  private constructor(props: RoleProps) {
    super(props.uid, props.createdBy, props.createdAt)
    this._id = props.id
    this._name = props.name
    this._permissions = props.permissions
    this._deletedAt = props.deletedAt
    this.updatedAt = props.updatedAt
    this.updatedBy = props.updatedBy
  }

  static create(props: CreateRoleProps): Role {
    Role.validateName(props.name)

    return new Role({
      id: 0,
      uid: crypto.randomUUID(),
      name: props.name.trim(),
      permissions: [],
      createdAt: new Date(),
      createdBy: props.createdBy,
      updatedAt: null,
      updatedBy: null,
      deletedAt: null,
    })
  }

  static reconstitute(props: RoleProps): Role {
    return new Role(props)
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new ValidationError(
        'El nombre del rol debe tener al menos 2 caracteres',
        'name',
      )
    }
  }

  updateName(name: string, updatedBy: number): void {
    Role.validateName(name)
    this._name = name.trim()
    this.markUpdated(updatedBy)
  }

  deactivate(updatedBy: number): void {
    this._deletedAt = new Date()
    this.markUpdated(updatedBy)
  }

  activate(updatedBy: number): void {
    this._deletedAt = null
    this.markUpdated(updatedBy)
  }

  get id(): number {
    return this._id
  }
  get name(): string {
    return this._name
  }
  get permissions(): Permission[] {
    return [...this._permissions]
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
