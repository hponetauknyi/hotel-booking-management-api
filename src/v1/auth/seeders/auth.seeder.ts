import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/v1/admin/entities/admin.entity';
import { User, UserRegistrationStage } from 'src/v1/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ModuleEntity } from '../entities/module.entity';
import {
  ActionType,
  Permission,
  PermissionModule,
} from '../entities/permission.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { Role } from '../entities/role.entity';

interface RoleConfig {
  name: string;
  description: string;
  rank?: number;
  modules: {
    [module: string]: ActionType[];
  };
}

interface ModuleSeed {
  name: string;
  code: PermissionModule;
  children?: {
    name: string;
    code: PermissionModule;
  }[];
}

@Injectable()
export class AuthSeeder {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ModuleEntity)
    private moduleRepository: Repository<ModuleEntity>,
  ) {}

  private readonly ADMIN_ONLY_MODULES: PermissionModule[] = [
    PermissionModule.ADMIN,
    PermissionModule.ADMIN_LIST,
    PermissionModule.ADMIN_ROLE_PERMISSIONS,
  ];

  private getRoleConfigurations(allModules: string[]): RoleConfig[] {
    const ALL = Object.values(ActionType) as ActionType[];
    const READ_ONLY = [ActionType.READ];
    const READ_WRITE = [ActionType.CREATE, ActionType.READ, ActionType.UPDATE];
    // const READ_WRITE_DELETE = [
    //   ActionType.CREATE,
    //   ActionType.READ,
    //   ActionType.UPDATE,
    //   ActionType.DELETE,
    // ];

    // Super Admin: full access to every seeded module
    const allModuleAccess = Object.fromEntries(
      allModules.map((module) => [module, ALL]),
    );

    // Admin: full access to everything except admin-management modules
    const adminModuleAccess = Object.fromEntries(
      allModules
        .filter(
          (module) =>
            !this.ADMIN_ONLY_MODULES.includes(module as PermissionModule),
        )
        .map((module) => [module, ALL]),
    );

    // Customer: own bookings + own profile + read-only on public content
    const customerModuleAccess: { [module: string]: ActionType[] } = {
      // Public content — read only
      [PermissionModule.HOTELS]: READ_ONLY,
      [PermissionModule.HOTEL_LIST]: READ_ONLY,
      [PermissionModule.ROOMS]: READ_ONLY,
      [PermissionModule.ROOM_LIST]: READ_ONLY,
      [PermissionModule.ROOM_TYPES]: READ_ONLY,
      [PermissionModule.ROOM_TYPE_LIST]: READ_ONLY,
      // Rate options — read only (customers browse rates to make bookings)
      [PermissionModule.RATE_OPTIONS]: READ_ONLY,
      [PermissionModule.RATE_OPTION_LIST]: READ_ONLY,
      // Own bookings — create + read + update (for cancellation); no delete
      [PermissionModule.BOOKINGS]: READ_WRITE,
      [PermissionModule.BOOKING_LIST]: READ_ONLY,
      // Own profile — read + update; no create/delete (account lifecycle is separate)
      [PermissionModule.PROFILE]: [ActionType.READ, ActionType.UPDATE],
    };

    return [
      {
        name: 'Super Admin',
        description: 'Super Administrator role with full access',
        rank: 1,
        modules: allModuleAccess,
      },
      {
        name: 'Admin',
        description: 'Administrator role with access to most features',
        rank: 2,
        modules: adminModuleAccess,
      },
      {
        name: 'Customer',
        description:
          'Authenticated customer — can browse hotels/rooms, manage own bookings and profile',
        rank: 3,
        modules: customerModuleAccess,
      },
    ];
  }

  async seed() {
    const modulesToSeed: ModuleSeed[] = [
      {
        name: 'Admin',
        code: PermissionModule.ADMIN,
        children: [
          { name: 'Admin List', code: PermissionModule.ADMIN_LIST },
          {
            name: 'Admin Role Permissions',
            code: PermissionModule.ADMIN_ROLE_PERMISSIONS,
          },
        ],
      },
      {
        name: 'Setting',
        code: PermissionModule.SETTING,
        children: [
          { name: 'SMTP Setting', code: PermissionModule.SETTING_SMTP },
        ],
      },
      {
        name: 'Application User',
        code: PermissionModule.APPLICATION_USER,
        children: [
          {
            name: 'Application User List',
            code: PermissionModule.APPLICATION_USER_LIST,
          },
        ],
      },
      {
        name: 'Logs',
        code: PermissionModule.LOGS,
        children: [
          { name: 'Activity Logs', code: PermissionModule.ACTIVITY_LOGS },
          { name: 'Audit Logs', code: PermissionModule.AUDIT_LOGS },
        ],
      },
      {
        name: 'Hotels',
        code: PermissionModule.HOTELS,
        children: [{ name: 'Hotel List', code: PermissionModule.HOTEL_LIST }],
      },
      {
        name: 'Rooms',
        code: PermissionModule.ROOMS,
        children: [{ name: 'Room List', code: PermissionModule.ROOM_LIST }],
      },
      {
        name: 'Room Types',
        code: PermissionModule.ROOM_TYPES,
        children: [
          { name: 'Room Type List', code: PermissionModule.ROOM_TYPE_LIST },
        ],
      },
      {
        name: 'Rate Options',
        code: PermissionModule.RATE_OPTIONS,
        children: [
          {
            name: 'Rate Option List',
            code: PermissionModule.RATE_OPTION_LIST,
          },
        ],
      },
      {
        name: 'Bookings',
        code: PermissionModule.BOOKINGS,
        children: [
          { name: 'Booking List', code: PermissionModule.BOOKING_LIST },
        ],
      },
      {
        name: 'Profile',
        code: PermissionModule.PROFILE,
      },
    ];

    const createdModules: ModuleEntity[] = [];

    for (const moduleSeed of modulesToSeed) {
      let moduleEntity = await this.moduleRepository.findOne({
        where: { code: moduleSeed.code },
      });

      if (!moduleEntity) {
        moduleEntity = this.moduleRepository.create({
          name: moduleSeed.name,
          code: moduleSeed.code,
        });
        moduleEntity = await this.moduleRepository.save(moduleEntity);
      }

      if (moduleSeed.children?.length) {
        for (const child of moduleSeed.children) {
          let childModule = await this.moduleRepository.findOne({
            where: { code: child.code, parentId: moduleEntity.id },
          });

          if (!childModule) {
            childModule = this.moduleRepository.create({
              name: child.name,
              code: child.code,
              parentId: moduleEntity.id,
            });
            childModule = await this.moduleRepository.save(childModule);
          }

          createdModules.push(childModule);
        }
      }

      createdModules.push(moduleEntity);
    }

    const moduleCodes = createdModules.map((m) => m.code);
    const roleConfigs = this.getRoleConfigurations(moduleCodes);

    const modulePermissions: { [moduleCode: string]: Permission[] } = {};
    for (const moduleEntity of createdModules) {
      modulePermissions[moduleEntity.code] =
        await this.createModulePermissions(moduleEntity);
    }

    const createdRoles: Role[] = [];
    for (const roleConfig of roleConfigs) {
      const role = await this.createRole(
        roleConfig.name,
        roleConfig.description,
        roleConfig.rank,
      );
      createdRoles.push(role);

      await this.assignPermissionsToRoleFromConfig(
        role,
        roleConfig.modules,
        modulePermissions,
      );
    }

    const superAdminRole = createdRoles.find((r) => r.name === 'Super Admin');
    if (superAdminRole) await this.createSuperAdmin(superAdminRole);

    const adminRole = createdRoles.find((r) => r.name === 'Admin');
    if (adminRole) await this.createAdminUser(adminRole);

    const customerRole = createdRoles.find((r) => r.name === 'Customer');
    if (customerRole) await this.createCustomerUser(customerRole);
  }

  private async createRole(
    name: string,
    description: string,
    rank?: number,
  ): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({ where: { name } });
    if (existingRole) return existingRole;
    return this.roleRepository.save(
      this.roleRepository.create({ name, description, rank }),
    );
  }

  private async createModulePermissions(
    module: ModuleEntity,
  ): Promise<Permission[]> {
    const permissions: Permission[] = [];
    for (const actionType of Object.values(ActionType)) {
      const existing = await this.permissionRepository.findOne({
        where: { moduleId: module.id, action: actionType },
      });
      if (!existing) {
        const p = this.permissionRepository.create({
          moduleId: module.id,
          action: actionType,
        });
        permissions.push(await this.permissionRepository.save(p));
      } else {
        permissions.push(existing);
      }
    }
    return permissions;
  }

  private async assignPermissionsToRoleFromConfig(
    role: Role,
    moduleConfig: { [module: string]: ActionType[] },
    modulePermissions: { [module: string]: Permission[] },
  ) {
    for (const [module, allowed] of Object.entries(moduleConfig)) {
      const permissions = modulePermissions[module] ?? [];
      const filtered = permissions.filter((p) => allowed.includes(p.action));
      await this.assignPermissionsToRole(role, filtered);
    }
  }

  private async assignPermissionsToRole(role: Role, permissions: Permission[]) {
    for (const permission of permissions) {
      const exists = await this.rolePermissionRepository.findOne({
        where: { roleId: role.id, permissionId: permission.id },
      });
      if (!exists) {
        await this.rolePermissionRepository.save(
          this.rolePermissionRepository.create({
            roleId: role.id,
            permissionId: permission.id,
          }),
        );
      }
    }
  }

  private async createSuperAdmin(role: Role): Promise<void> {
    const email = 'arkarmin@obs.com.mm';
    const existing = await this.adminRepository.findOne({ where: { email } });
    if (!existing) {
      await this.adminRepository.save(
        this.adminRepository.create({
          email,
          fullName: 'Super Admin',
          roleId: role.id,
          password: 'passwordD123!@#',
        }),
      );
    }
  }

  private async createAdminUser(role: Role): Promise<void> {
    const email = 'admin@obs.com.mm';
    const existing = await this.adminRepository.findOne({ where: { email } });
    if (!existing) {
      await this.adminRepository.save(
        this.adminRepository.create({
          email,
          fullName: 'Admin',
          roleId: role.id,
          password: 'passwordD123!@#',
        }),
      );
    }
  }

  private async createCustomerUser(role: Role): Promise<void> {
    const email = 'customer@obs.com.mm';
    const existing = await this.userRepository.findOne({ where: { email } });
    if (!existing) {
      await this.userRepository.save(
        this.userRepository.create({
          email,
          fullName: 'Customer',
          phone: '095085730',
          registrationStage: UserRegistrationStage.COMPLETED,
          roleId: role.id,
          password: 'passwordD123!@#',
        }),
      );
    }
  }
}
