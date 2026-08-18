import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Order,
  AllocationConflict,
  ReorderRecommendation,
  PickingTask,
  BottleneckReport,
  OperationalException,
  AuditLog,
  NotificationItem,
  UserRole,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CONFLICTS,
  INITIAL_REORDERS,
  INITIAL_PICKING_TASKS,
  INITIAL_BOTTLENECK_REPORTS,
  INITIAL_EXCEPTIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from '../services/mockData';

interface AppDataContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  products: Product[];
  orders: Order[];
  conflicts: AllocationConflict[];
  reorders: ReorderRecommendation[];
  pickingTasks: PickingTask[];
  bottlenecks: BottleneckReport[];
  exceptions: OperationalException[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  approveAllocation: (conflictId: string) => void;
  overrideAllocation: (conflictId: string, allocations: Record<string, number>) => void;
  createPurchaseOrder: (reorderId: string) => void;
  optimizePickingRoute: (taskId: string) => void;
  resolveException: (exceptionId: string, note?: string) => void;
  reassignWorkersToZone: (targetZone: string, workerCount: number) => void;
  markNotificationRead: (id: string) => void;
  triggerDemoScenario: (scenarioId: number) => void;
  askAssistant: (question: string) => { answer: string; intent: string; actionUrl?: string };
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addOrder: (order: Order) => void;
  resetToDemoData: () => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

// Helper for localStorage with fallback
function loadStoredData<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(`Error loading ${key} from localStorage`, e);
  }
  return fallback;
}

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>(() => loadStoredData('ws_user_role', 'Warehouse Manager'));
  const [products, setProducts] = useState<Product[]>(() => loadStoredData('ws_products', INITIAL_PRODUCTS));
  const [orders, setOrders] = useState<Order[]>(() => loadStoredData('ws_orders', INITIAL_ORDERS));
  const [conflicts, setConflicts] = useState<AllocationConflict[]>(() => loadStoredData('ws_conflicts', INITIAL_CONFLICTS));
  const [reorders, setReorders] = useState<ReorderRecommendation[]>(() => loadStoredData('ws_reorders', INITIAL_REORDERS));
  const [pickingTasks, setPickingTasks] = useState<PickingTask[]>(() => loadStoredData('ws_picking_tasks', INITIAL_PICKING_TASKS));
  const [bottlenecks, setBottlenecks] = useState<BottleneckReport[]>(() => loadStoredData('ws_bottlenecks', INITIAL_BOTTLENECK_REPORTS));
  const [exceptions, setExceptions] = useState<OperationalException[]>(() => loadStoredData('ws_exceptions', INITIAL_EXCEPTIONS));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadStoredData('ws_audit_logs', INITIAL_AUDIT_LOGS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadStoredData('ws_notifications', INITIAL_NOTIFICATIONS));

  // Sync state changes to localStorage
  useEffect(() => { localStorage.setItem('ws_user_role', JSON.stringify(userRole)); }, [userRole]);
  useEffect(() => { localStorage.setItem('ws_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('ws_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('ws_conflicts', JSON.stringify(conflicts)); }, [conflicts]);
  useEffect(() => { localStorage.setItem('ws_reorders', JSON.stringify(reorders)); }, [reorders]);
  useEffect(() => { localStorage.setItem('ws_picking_tasks', JSON.stringify(pickingTasks)); }, [pickingTasks]);
  useEffect(() => { localStorage.setItem('ws_bottlenecks', JSON.stringify(bottlenecks)); }, [bottlenecks]);
  useEffect(() => { localStorage.setItem('ws_exceptions', JSON.stringify(exceptions)); }, [exceptions]);
  useEffect(() => { localStorage.setItem('ws_audit_logs', JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem('ws_notifications', JSON.stringify(notifications)); }, [notifications]);

  // 1. Add New Product (Admin / User Input)
  const addProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    const newAudit: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: 'New Product Catalog Entry Added',
      decision: `Added ${newProduct.name} (${newProduct.sku})`,
      reason: 'User manual inventory entry',
      performedBy: userRole,
      approvedBy: userRole,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  // 1b. Update Product
  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
  };

  // 1c. Delete Product
  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // 2. Add New Order (User / Customer Input)
  const addOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    const newAudit: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: 'New Order Received',
      orderId: newOrder.id,
      decision: `Order ${newOrder.id} logged for ${newOrder.customerName}`,
      reason: `Calculated priority score ${newOrder.priorityScore} (${newOrder.priority})`,
      performedBy: userRole,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  // 3. Reset All Data to Demo Defaults
  const resetToDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setConflicts(INITIAL_CONFLICTS);
    setReorders(INITIAL_REORDERS);
    setPickingTasks(INITIAL_PICKING_TASKS);
    setBottlenecks(INITIAL_BOTTLENECK_REPORTS);
    setExceptions(INITIAL_EXCEPTIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.clear();
  };

  // 4. Approve AI Allocation Recommendation
  const approveAllocation = (conflictId: string) => {
    const conflict = conflicts.find((c) => c.id === conflictId);
    if (!conflict) return;

    const allocations = conflict.recommendedDecision.orderAllocations;

    // Update orders
    setOrders((prev) =>
      prev.map((ord) => {
        if (allocations[ord.id] !== undefined) {
          const qtyAllocated = allocations[ord.id];
          const isFull = ord.items.every((it) => it.quantityRequested <= qtyAllocated);
          return {
            ...ord,
            status: qtyAllocated > 0 ? (isFull ? 'Allocated' : 'Partially Allocated') : 'Pending Allocation',
            items: ord.items.map((it) =>
              it.productId === conflict.productId ? { ...it, quantityAllocated: qtyAllocated } : it
            ),
          };
        }
        return ord;
      })
    );

    // Update Product reserved/available quantities
    const totalAllocated = Object.values(allocations).reduce((a, b) => a + b, 0);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === conflict.productId
          ? {
              ...p,
              reservedQuantity: p.reservedQuantity + totalAllocated,
              availableQuantity: Math.max(0, p.availableQuantity - totalAllocated),
            }
          : p
      )
    );

    // Update conflict status
    setConflicts((prev) => prev.map((c) => (c.id === conflictId ? { ...c, status: 'Approved' } : c)));

    // Log Audit Event
    const newAudit: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: 'Allocation Conflict Approved',
      orderId: Object.keys(allocations)[0],
      decision: `Approved allocation: ${JSON.stringify(allocations)}`,
      reason: conflict.recommendedDecision.explanation,
      performedBy: 'AI Decision Engine',
      approvedBy: userRole,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    // Push notification
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      type: 'Allocation Approved',
      severity: 'Info',
      title: 'Allocation Resolved',
      message: `Inventory contention for ${conflict.productName} successfully allocated.`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // 5. Manual Override Allocation
  const overrideAllocation = (conflictId: string, allocations: Record<string, number>) => {
    setConflicts((prev) => prev.map((c) => (c.id === conflictId ? { ...c, status: 'Overridden' } : c)));

    const newAudit: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: 'Allocation Overridden by User',
      decision: `Manual custom allocation enforced: ${JSON.stringify(allocations)}`,
      reason: 'User manager override applied via Allocation Center UI',
      performedBy: userRole,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  // 6. Create Purchase Recommendation
  const createPurchaseOrder = (reorderId: string) => {
    setReorders((prev) => prev.map((r) => (r.id === reorderId ? { ...r, status: 'Ordered' } : r)));
    const target = reorders.find((r) => r.id === reorderId);

    const newAudit: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: 'Purchase Recommendation Executed',
      decision: `PO Created for ${target?.recommendedOrderQty} units of ${target?.productName}`,
      reason: target?.reason || 'Smart Reorder calculation',
      performedBy: userRole,
      approvedBy: userRole,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  // 7. Optimize Picking Route
  const optimizePickingRoute = (taskId: string) => {
    setPickingTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              estimatedTimeMin: t.optimizedTimeMin,
              routeSequence: t.routeSequence,
            }
          : t
      )
    );

    const newAudit: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: 'Picking Route Optimized',
      decision: 'TSP Aisle Heuristic Applied (Travel time reduced from 18.5m to 11.2m)',
      reason: 'Aisle proximity re-sequenced: A1 -> A5 -> B2 -> B7 -> C3',
      performedBy: 'Route Optimization Engine',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  // 8. Resolve Exception
  const resolveException = (exceptionId: string, note?: string) => {
    setExceptions((prev) =>
      prev.map((ex) => (ex.id === exceptionId ? { ...ex, status: 'Resolved' } : ex))
    );

    const targetEx = exceptions.find((e) => e.id === exceptionId);

    const newAudit: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: 'Exception Resolved',
      orderId: targetEx?.orderId,
      decision: `Exception ${exceptionId} marked Resolved`,
      reason: note || targetEx?.suggestedAction || 'Root cause addressed',
      performedBy: userRole,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  // 9. Reassign Workers
  const reassignWorkersToZone = (targetZone: string, workerCount: number) => {
    setBottlenecks((prev) =>
      prev.map((b) =>
        b.zone.includes(targetZone)
          ? {
              ...b,
              assignedWorkers: b.assignedWorkers + workerCount,
              averagePickTimeMin: parseFloat((b.averagePickTimeMin * 0.7).toFixed(1)),
              recommendation: `Worker re-allocation active (+${workerCount} pickers assigned). Picking speed improving.`,
            }
          : b
      )
    );
  };

  // 10. Mark notification as read
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  // 11. Trigger Demo Scenarios
  const triggerDemoScenario = (scenarioId: number) => {
    if (scenarioId === 1) {
      approveAllocation('CONF-001');
    } else if (scenarioId === 2) {
      createPurchaseOrder('REORD-001');
    } else if (scenarioId === 3) {
      optimizePickingRoute('PICK-101');
      reassignWorkersToZone('Zone B', 2);
    } else if (scenarioId === 4) {
      resolveException('EX-1042', 'Rapid replenishment runner picked 1 unit from C-14.');
    }
  };

  // 12. Enhanced NLP Assistant engine
  const askAssistant = (question: string) => {
    const q = question.toLowerCase().trim();

    const orderIdMatch = q.match(/(?:ord[-#\s]*|order[-#\s]*)?(\d{4})/i);
    const extractedOrderId = orderIdMatch ? `ORD-${orderIdMatch[1]}` : null;

    if (
      extractedOrderId ||
      q.includes('order') ||
      q.includes('where is') ||
      q.includes('status') ||
      q.includes('update') ||
      q.includes('track')
    ) {
      if (extractedOrderId) {
        const foundOrder = orders.find((o) => o.id === extractedOrderId);
        if (foundOrder) {
          return {
            intent: 'order_status',
            answer: `Order ${foundOrder.id} for ${foundOrder.customerName} (${foundOrder.customerTier} Tier) is currently in status: [${foundOrder.status}]. Priority: ${foundOrder.priority} (Score: ${foundOrder.priorityScore}/100). Dispatch deadline is ${new Date(foundOrder.dispatchDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Items: ${foundOrder.items.map((i) => `${i.productName} (x${i.quantityRequested})`).join(', ')}.`,
            actionUrl: `/orders/${foundOrder.id}`,
          };
        }
      }

      if (q.includes('where') || q.includes('update') || q.includes('my order') || q.includes('order status') || q.includes('track')) {
        const statusCounts = orders.reduce((acc, o) => {
          acc[o.status] = (acc[o.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const summaryText = Object.entries(statusCounts)
          .map(([st, cnt]) => `${cnt} in ${st}`)
          .join(', ');

        return {
          intent: 'order_status',
          answer: `Here is the real-time breakdown of all ${orders.length} active orders: ${summaryText}. Order #1042 (Enterprise Tier) is at highest priority in [Pending Allocation] with deadline in 50 minutes. Order #1039 is currently being picked by Dave Miller in Zone B.`,
          actionUrl: '/orders',
        };
      }
    }

    if (q.includes('risk') || q.includes('critical') || q.includes('urgent') || q.includes('deadline') || q.includes('sla')) {
      const criticals = orders.filter((o) => o.priority === 'Critical');
      return {
        intent: 'critical_orders',
        answer: `There are currently ${criticals.length} CRITICAL orders at high SLA risk: ${criticals.map((c) => `${c.id} (${c.customerName}, Deadline: ${new Date(c.dispatchDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`).join('; ')}. Order #1042 requires immediate inventory allocation approval.`,
        actionUrl: '/orders',
      };
    }

    if (q.includes('shortage') || q.includes('conflict') || q.includes('competing') || q.includes('allocation') || q.includes('mouse') || q.includes('remaining stock') || q.includes('receive')) {
      return {
        intent: 'allocation_conflict',
        answer:
          'Wireless Optical Mouse (SKU: WM-OPT-BLK) has 7 units remaining vs 15 units demanded across Order #1042 (10 requested, Critical 94) and Order #1047 (5 requested, Medium 62). Recommended decision: Allocate all 7 remaining units to Order #1042 because it has an imminent dispatch deadline (in 50 mins) and Enterprise SLA priority.',
        actionUrl: '/allocation',
      };
    }

    if (q.includes('low stock') || q.includes('out of stock') || q.includes('inventory') || q.includes('stock') || q.includes('sku') || q.includes('product')) {
      const lowStock = products.filter((p) => p.status === 'Low Stock' || p.status === 'Critical');
      const outOfStock = products.filter((p) => p.status === 'Out of Stock');
      return {
        intent: 'inventory_status',
        answer: `Inventory Overview: ${products.length} total SKUs tracked. Low Stock (${lowStock.length}): ${lowStock.slice(0, 3).map((p) => `${p.name} [${p.availableQuantity} avail]`).join(', ')}. Out of Stock (${outOfStock.length}): ${outOfStock.map((p) => p.name).join(', ')}. Reorder recommendations are ready for manager execution.`,
        actionUrl: '/inventory',
      };
    }

    if (q.includes('reorder') || q.includes('purchase order') || q.includes('replenish') || q.includes('buy')) {
      return {
        intent: 'reorder_recommendation',
        answer:
          'Smart Reorder Engine recommends 2 purchase orders: (1) Wireless Optical Mouse: +75 units (Based on 12 units/day demand, 5-day lead time, 20 safety stock), (2) 27-inch 4K Monitor: +30 units.',
        actionUrl: '/inventory',
      };
    }

    if (q.includes('zone') || q.includes('bottleneck') || q.includes('picking') || q.includes('slow') || q.includes('picker')) {
      return {
        intent: 'bottleneck_analysis',
        answer:
          'Zone B (Peripherals & Displays) is identified as the top picking bottleneck. Average pick time is 18.4 minutes (65% slower than the 11.1 min warehouse baseline), impacting 32 orders. Action: Reassign 2 pickers from Zone A to Zone B and apply TSP route optimization.',
        actionUrl: '/picking',
      };
    }

    if (q.includes('why') || q.includes('explain') || q.includes('priority score') || q.includes('delayed')) {
      const targetId = extractedOrderId || 'ORD-1042';
      return {
        intent: 'priority_explanation',
        answer:
          `Order ${targetId} is delayed/at SLA risk because its dispatch deadline expires in under 50 minutes while awaiting inventory allocation of Wireless Optical Mouse (7 units available vs 10 requested). AI Priority Score is 94/100 due to Enterprise Tier SLA.`,
        actionUrl: '/orders/ORD-1042',
      };
    }

    if (q.includes('exception') || q.includes('damaged') || q.includes('mismatch') || q.includes('qc') || q.includes('issue')) {
      const openEx = exceptions.filter((e) => e.status === 'Open');
      return {
        intent: 'exception_status',
        answer: `There are ${exceptions.length} operational exceptions logged (${openEx.length} open). Primary issue: EX-1042 (Quantity Mismatch on Order #1031 in Zone C - 9 units found vs 10 expected). Rapid runner pick dispatched.`,
        actionUrl: '/exceptions',
      };
    }

    if (q.includes('dispatch') || q.includes('ship') || q.includes('carrier') || q.includes('fedex')) {
      return {
        intent: 'dispatch_status',
        answer:
          'Dispatch Status: 1 order ready for dispatch (Order #1028 via FedEx Express Priority). 1 order pending quality inspection (Order #1031). Target SLA fulfillment rate is 96.2%.',
        actionUrl: '/dispatch',
      };
    }

    return {
      intent: 'general_query',
      answer: `WareSmart AI operational summary for your query "${question}": 6 active orders in pipeline (${orders.filter((o) => o.priority === 'Critical').length} Critical SLA risk), 1 inventory allocation conflict pending manager approval for Wireless Optical Mouse, and Zone B picking route optimization ready.`,
      actionUrl: '/dashboard',
    };
  };

  return (
    <AppDataContext.Provider
      value={{
        userRole,
        setUserRole,
        products,
        orders,
        conflicts,
        reorders,
        pickingTasks,
        bottlenecks,
        exceptions,
        auditLogs,
        notifications,
        approveAllocation,
        overrideAllocation,
        createPurchaseOrder,
        optimizePickingRoute,
        resolveException,
        reassignWorkersToZone,
        markNotificationRead,
        triggerDemoScenario,
        askAssistant,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        resetToDemoData,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
