import assert from "node:assert";
import { TOUR_STEPS } from "../lib/tour/tourSteps";
import { isRouteMatch } from "../lib/tour/routeTourResolver";

console.log("🧪 Running Wysbryx Tour Architecture Unit Tests...\n");

// Test 1: Declarative Step Validation
console.log("Test 1: Validating tour step configurations...");
assert.strictEqual(Array.isArray(TOUR_STEPS), true, "TOUR_STEPS must be an array");
assert.ok(TOUR_STEPS.length >= 5, `Expected at least 5 steps in streamlined flow, got ${TOUR_STEPS.length}`);

TOUR_STEPS.forEach((step, idx) => {
  assert.ok(step.id, `Step at index ${idx} missing ID`);
  assert.ok(step.target, `Step ${step.id} missing target selector`);
  assert.ok(step.title, `Step ${step.id} missing title`);
  assert.ok(step.description, `Step ${step.id} missing description`);
  assert.ok(step.action, `Step ${step.id} missing action type`);
  console.log(`  ✓ Step ${idx + 1} (${step.id}): target='${step.target}', action='${step.action}'`);
});

// Test 2: Route Matching Resolver Logic
console.log("\nTest 2: Validating route matching resolver logic...");
assert.strictEqual(isRouteMatch("/", "/"), true, "Root route should match /");
assert.strictEqual(isRouteMatch("/ai-eval", "/"), false, "Root step should not match /ai-eval");
assert.strictEqual(isRouteMatch("/ai-eval", "/ai-eval"), true, "/ai-eval should match /ai-eval");
assert.strictEqual(isRouteMatch("/ai-eval/employee/123", "/ai-eval/employee"), true, "Sub-route should match parent route");
assert.strictEqual(isRouteMatch("/dashboard", "/ai-eval"), false, "Different route should not match");
console.log("  ✓ Route resolver correctly handles root, exact, and parent sub-routes.");

// Test 3: Action-Gated Step Integrity
console.log("\nTest 3: Validating action-gated step sequence...");
const entryStep = TOUR_STEPS.find((s) => s.id === "ai-eval-entry");
assert.strictEqual(entryStep?.action, "click", "ai-eval-entry step must require click action");
assert.strictEqual(entryStep?.route, "/", "ai-eval-entry step must be on root route");

const nameStep = TOUR_STEPS.find((s) => s.id === "evaluator-name");
assert.strictEqual(nameStep?.action, "input", "evaluator-name step must require input action");
assert.strictEqual(nameStep?.route, "/ai-eval", "evaluator-name step must be on /ai-eval route");

const auditStep = TOUR_STEPS.find((s) => s.id === "candidate-audit");
assert.strictEqual(auditStep?.action, "click", "candidate-audit step must require click action");

console.log("  ✓ Action gating rules and target routes are correctly configured.");

console.log("\n✅ All Tour Architecture Unit Tests Passed Successfully!");
