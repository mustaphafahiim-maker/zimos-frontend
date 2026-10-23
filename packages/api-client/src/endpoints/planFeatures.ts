/**
 * The store's plan features as a screen needs them to show itself locked
 * before a write is refused (backend: billing/planFeatureGate.planFeaturesFor,
 * GET /workspaces/:workspaceId/plan-features, any member).
 *
 * `features` are the catalogue keys the store holds right now — its plan's
 * plus the console's overrides — and `enforced` says whether the gate
 * (PLAN_FEATURE_ENFORCEMENT) refuses writes for a missing key. A gated
 * action (minting an API key, inviting a teammate) is locked only while the
 * gate is on; a benefit that follows the keys alone (hiding the platform
 * branding) is unavailable whenever the key is missing, gate or no gate.
 */
import type { ApiClient } from "../client";
import type { PlanFeatureKey } from "../types";

export interface WorkspacePlanFeatures {
  features: PlanFeatureKey[];
  enforced: boolean;
}

export async function workspacePlanFeatures(client: ApiClient, workspaceId: string): Promise<WorkspacePlanFeatures> {
  const { planFeatures } = await client.request<{ planFeatures: WorkspacePlanFeatures }>(
    `/workspaces/${workspaceId}/plan-features`
  );
  return planFeatures;
}

/** True while the store holds the key. */
export function planFeatureHeld(state: WorkspacePlanFeatures, key: PlanFeatureKey): boolean {
  return state.features.includes(key);
}

/** True when a route gated on the key would refuse: the gate is on and the key is missing. */
export function planFeatureGated(state: WorkspacePlanFeatures, key: PlanFeatureKey): boolean {
  return state.enforced && !planFeatureHeld(state, key);
}
