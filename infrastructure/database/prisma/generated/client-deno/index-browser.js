
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.3.1
 * Query Engine version: acc0b9dd43eb689cbd20c9470515d719db10d0b0
 */
Prisma.prismaVersion = {
  client: "6.3.1",
  engine: "acc0b9dd43eb689cbd20c9470515d719db10d0b0"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  idUser: 'idUser',
  type: 'type',
  message: 'message',
  date: 'date',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  firstname: 'firstname',
  lastname: 'lastname',
  hashedPassword: 'hashedPassword',
  emailAddress: 'emailAddress',
  phoneNumber: 'phoneNumber',
  address: 'address',
  isAdministrator: 'isAdministrator',
  token: 'token',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DealerScalarFieldEnum = {
  id: 'id',
  site: 'site',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EnterpriseScalarFieldEnum = {
  id: 'id',
  taxNumber: 'taxNumber',
  industryType: 'industryType',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ClientScalarFieldEnum = {
  id: 'id',
  idDealer: 'idDealer',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TestRideScalarFieldEnum = {
  id: 'id',
  idClient: 'idClient',
  idMotorcycle: 'idMotorcycle',
  date: 'date',
  feedback: 'feedback',
  isCompleted: 'isCompleted',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RentalScalarFieldEnum = {
  id: 'id',
  idClient: 'idClient',
  idMotorcycle: 'idMotorcycle',
  startDate: 'startDate',
  endDate: 'endDate',
  cost: 'cost',
  isCompleted: 'isCompleted',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MotorcycleScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  dealerId: 'dealerId',
  enterpriseId: 'enterpriseId',
  brand: 'brand',
  model: 'model',
  year: 'year',
  registrationNumber: 'registrationNumber',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MotorcyclePartScalarFieldEnum = {
  idMotorcycle: 'idMotorcycle',
  idPart: 'idPart',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PartScalarFieldEnum = {
  id: 'id',
  idDealer: 'idDealer',
  idOrder: 'idOrder',
  reference: 'reference',
  type: 'type',
  price: 'price',
  stockQuantity: 'stockQuantity',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  parts: 'parts',
  orderDate: 'orderDate',
  status: 'status',
  totalAmount: 'totalAmount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WarrantyPartsScalarFieldEnum = {
  idPart: 'idPart',
  idWarranty: 'idWarranty',
  actionDate: 'actionDate',
  actionType: 'actionType',
  status: 'status',
  coveredCost: 'coveredCost',
  remainingCost: 'remainingCost',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WarrantyScalarFieldEnum = {
  id: 'id',
  idMotorcycle: 'idMotorcycle',
  type: 'type',
  startDate: 'startDate',
  endDate: 'endDate',
  terms: 'terms',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MaintenanceScalarFieldEnum = {
  id: 'id',
  idMotorcycle: 'idMotorcycle',
  date: 'date',
  description: 'description',
  cost: 'cost',
  motorcycleHistoryId: 'motorcycleHistoryId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.IncidentScalarFieldEnum = {
  id: 'id',
  idMotorcycle: 'idMotorcycle',
  type: 'type',
  description: 'description',
  reportDate: 'reportDate',
  resolutionDate: 'resolutionDate',
  motorcycleHistoryId: 'motorcycleHistoryId',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DriverScalarFieldEnum = {
  id: 'id',
  enterpriseId: 'enterpriseId',
  motorcycleId: 'motorcycleId',
  firstname: 'firstname',
  lastname: 'lastname',
  licenseNumber: 'licenseNumber',
  phoneNumber: 'phoneNumber',
  emailAddress: 'emailAddress',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MotorcycleHistoryScalarFieldEnum = {
  id: 'id',
  motorcycleId: 'motorcycleId',
  startDate: 'startDate',
  endDate: 'endDate',
  clientId: 'clientId',
  enterpriseId: 'enterpriseId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.NotificationType = exports.$Enums.NotificationType = {
  info: 'info',
  alerte: 'alerte',
  erreur: 'erreur'
};

exports.NotificationStatus = exports.$Enums.NotificationStatus = {
  read: 'read',
  unread: 'unread'
};

exports.IndustryType = exports.$Enums.IndustryType = {
  restaurant: 'restaurant',
  coursier: 'coursier',
  divertissement: 'divertissement'
};

exports.MotorcycleStatus = exports.$Enums.MotorcycleStatus = {
  available: 'available',
  rented: 'rented',
  in_maintenance: 'in_maintenance'
};

exports.OrderStatus = exports.$Enums.OrderStatus = {
  awaiting: 'awaiting',
  confirmed: 'confirmed',
  canceled: 'canceled'
};

exports.ActionType = exports.$Enums.ActionType = {
  repaired: 'repaired',
  replaced: 'replaced'
};

exports.WarrantyStatus = exports.$Enums.WarrantyStatus = {
  in_progress: 'in_progress',
  done: 'done',
  canceled: 'canceled'
};

exports.IncidentType = exports.$Enums.IncidentType = {
  panne: 'panne',
  accident: 'accident'
};

exports.IncidentStatus = exports.$Enums.IncidentStatus = {
  pending: 'pending',
  resolved: 'resolved',
  in_progress: 'in_progress'
};

exports.Prisma.ModelName = {
  Notification: 'Notification',
  User: 'User',
  Dealer: 'Dealer',
  Enterprise: 'Enterprise',
  Client: 'Client',
  TestRide: 'TestRide',
  Rental: 'Rental',
  Motorcycle: 'Motorcycle',
  MotorcyclePart: 'MotorcyclePart',
  Part: 'Part',
  Order: 'Order',
  WarrantyParts: 'WarrantyParts',
  Warranty: 'Warranty',
  Maintenance: 'Maintenance',
  Incident: 'Incident',
  Driver: 'Driver',
  MotorcycleHistory: 'MotorcycleHistory'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
