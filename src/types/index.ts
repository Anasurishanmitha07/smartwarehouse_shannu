export type UserRole = 'Warehouse Manager' | 'Warehouse Operator' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type ProductStatus = 'Healthy' | 'Low Stock' | 'Critical' | 'Out of Stock' | 'Damaged';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  warehouse: string;
  location: string;
  totalQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  damagedQuantity: number;
  reorderLevel: number;
  safetyStock: number;
  supplier: string;
  leadTimeDays: number;
  averageDailyDemand: number;
  unitPrice: number;
  status: ProductStatus;
}

export type OrderPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type OrderStatus =
  | 'Created'
  | 'Pending Allocation'
  | 'Partially Allocated'
  | 'Allocated'
  | 'Picking'
  | 'Packed'
  | 'Quality Check'
  | 'Ready for Dispatch'
  | 'Dispatched'
  | 'Completed'
  | 'Delayed'
  | 'Cancelled';

export type RiskLevel = 'High Risk' | 'Medium Risk' | 'On Track';

export interface OrderItem {
  productId: string;
  sku: string;
  productName: string;
  quantityRequested: number;
  quantityAllocated: number;
  unitPrice: number;
}

export interface PriorityBreakdown {
  deadlineUrgencyScore: number;
  slaRiskScore: number;
  customerTierScore: number;
  inventoryReadinessScore: number;
  orderAgeScore: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerTier: 'Enterprise' | 'VIP' | 'Standard';
  items: OrderItem[];
  totalValue: number;
  createdTime: string;
  dispatchDeadline: string;
  priority: OrderPriority;
  priorityScore: number; // 0-100
  priorityReasons: string[];
  priorityBreakdown: PriorityBreakdown;
  status: OrderStatus;
  riskLevel: RiskLevel;
  allocatedZone?: string;
  assignedPicker?: string;
}

export interface AllocationConflict {
  id: string;
  productId: string;
  productName: string;
  totalAvailable: number;
  demandingOrders: {
    orderId: string;
    customerName: string;
    requestedQty: number;
    priority: OrderPriority;
    priorityScore: number;
    dispatchDeadline: string;
  }[];
  recommendedDecision: {
    orderAllocations: Record<string, number>;
    explanation: string;
    impact: string;
  };
  status: 'Pending Review' | 'Approved' | 'Overridden';
}

export interface ReorderRecommendation {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  averageDailyDemand: number;
  leadTimeDays: number;
  safetyStock: number;
  expectedRequirement: number;
  recommendedOrderQty: number;
  reason: string;
  status: 'Recommended' | 'Ordered' | 'Ignored';
}

export interface PickingItem {
  productId: string;
  productName: string;
  location: string;
  quantity: number;
  picked: boolean;
}

export interface PickingTask {
  id: string;
  orderId: string;
  pickerName: string;
  zone: string;
  items: PickingItem[];
  routeSequence: string[]; // e.g. ["A1", "A5", "B2", "B7", "C3"]
  unoptimizedSequence: string[]; // e.g. ["A1", "C3", "B7", "A5", "B2"]
  estimatedTimeMin: number;
  optimizedTimeMin: number;
  status: 'Pending' | 'Picking' | 'Picked' | 'Missing Item' | 'Damaged Item';
}

export interface BottleneckReport {
  zone: string;
  averagePickTimeMin: number;
  warehouseAverageMin: number;
  delayedOrdersCount: number;
  errorRatePercent: number;
  recommendation: string;
  assignedWorkers: number;
}

export type ExceptionType =
  | 'Damaged Item'
  | 'Missing Item'
  | 'Stock Shortage'
  | 'Wrong Item'
  | 'Quantity Mismatch'
  | 'Picking Delay'
  | 'Packing Failure'
  | 'Quality Failure'
  | 'Dispatch Delay';

export interface OperationalException {
  id: string;
  type: ExceptionType;
  severity: 'Critical' | 'Warning' | 'Info';
  orderId: string;
  productId?: string;
  detectedTime: string;
  problemDescription: string;
  dataConsidered: string;
  aiDecision: string;
  reasoning: string;
  suggestedAction: string;
  expectedImpact: string;
  status: 'Open' | 'Analyzing' | 'Resolved' | 'Closed';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  event: string;
  orderId?: string;
  decision: string;
  reason: string;
  performedBy: string;
  approvedBy?: string;
}

export interface NotificationItem {
  id: string;
  type: string;
  severity: 'Critical' | 'Warning' | 'Info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}
