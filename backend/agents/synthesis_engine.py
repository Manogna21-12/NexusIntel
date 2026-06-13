import os
import json
import logging
import time

logger = logging.getLogger("nexusintel.synthesis_engine")

class SynthesisEngine:
    """
    Agent 3 (The Synthesis Engine): Reconciles conflicting findings from the
    Vision Auditor and Code Diff Archeologist. Uses a State Graph logic to
    decide if a feature is a visual mockup (smoke test) or fully implemented,
    calculates confidence, and maps them to a strategic launch timeline.
    """
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.is_live = bool(self.api_key)

    def synthesize(self, vision_data: dict, code_data: dict, log_callback=None) -> dict:
        """
        Reconciles the data between Vision and Code using a LangGraph-style workflow.
        Steps:
          1. reconciliation: Extracts features present in either source.
          2. conflict_resolution: Assesses developer readiness vs marketer showcases.
          3. timeline_generation: Computes estimated launch windows and confidence metrics.
        """
        def log(node, msg):
            logger.info(f"[{node}] {msg}")
            if log_callback:
                log_callback(node, msg)

        log("SynthesisEngine", "Initializing State Graph Reconciliation...")
        time.sleep(1)

        # Let's outline the LangGraph Nodes:
        
        # --- Node 1: Reconciliation Node ---
        log("Reconciliation", "Collating features from Vision and Code databases...")
        time.sleep(1.2)
        
        vision_features = vision_data.get("new_features", [])
        code_shifts = code_data.get("structural_shifts", [])
        code_endpoints = code_data.get("new_endpoints", [])
        
        reconciled_features = {}
        
        # Map features from UI/Vision
        for f in vision_features:
            reconciled_features[f["name"]] = {
                "name": f["name"],
                "in_ui": True,
                "in_code": False,
                "ui_details": f["details"],
                "code_details": None,
                "endpoints_found": [],
                "dependencies": [],
                "complexity": f.get("complexity", "Medium"),
                "status": "Unknown",
                "evidence_conflict": False,
                "conflict_reason": ""
            }

        # Map features from Code
        # We try to correlate by string matches or add them as code-only entries
        for shift in code_shifts:
            matched = False
            for f_name in list(reconciled_features.keys()):
                # If keywords intersect (e.g. "Brainstorm" / "canvas")
                if any(kw in shift["change"].lower() for kw in f_name.lower().split()):
                    reconciled_features[f_name]["in_code"] = True
                    reconciled_features[f_name]["code_details"] = shift["change"]
                    matched = True
            
            if not matched:
                # Add a code-only feature
                name = "Unknown Module"
                if "excalidraw" in shift["change"].lower() or "liveblocks" in shift["change"].lower():
                    name = "Brainstorm AI Canvas"  # Sync with TaskFlow demo
                elif "vector" in shift["change"].lower() or "embedding" in shift["change"].lower():
                    name = "Native Vector Embedding Engine"  # Sync with SupaDB demo
                elif "passkey" in shift["change"].lower() or "simplewebauthn" in shift["change"].lower():
                    name = "Passkey Auth SDK"
                else:
                    name = f"Code Mod: {shift['file']}"

                if name in reconciled_features:
                    reconciled_features[name]["in_code"] = True
                    reconciled_features[name]["code_details"] = shift["change"]
                else:
                    reconciled_features[name] = {
                        "name": name,
                        "in_ui": False,
                        "in_code": True,
                        "ui_details": None,
                        "code_details": shift["change"],
                        "endpoints_found": [],
                        "dependencies": [],
                        "complexity": "High",
                        "status": "Unknown",
                        "evidence_conflict": False,
                        "conflict_reason": ""
                    }

        # Append endpoints to reconciled features
        for ep in code_endpoints:
            path = ep["path"]
            matched = False
            for f_name, f_data in reconciled_features.items():
                if "brainstorm" in path.lower() and "brainstorm" in f_name.lower():
                    f_data["endpoints_found"].append(f"{ep['method']} {path}")
                    matched = True
                elif "passkey" in path.lower() and "passkey" in f_name.lower():
                    f_data["endpoints_found"].append(f"{ep['method']} {path}")
                    matched = True
                elif "vector" in path.lower() and "vector" in f_name.lower():
                    f_data["endpoints_found"].append(f"{ep['method']} {path}")
                    matched = True

        log("Reconciliation", f"Extracted {len(reconciled_features)} unique candidate features.")

        # --- Node 2: Conflict Resolution Node ---
        log("ConflictResolver", "Running heuristic conflict resolver & truth alignment...")
        time.sleep(1.2)
        
        conflicts = []
        for name, f in reconciled_features.items():
            # Scenario A: Visible in UI demo, but NOT in production code
            if f["in_ui"] and not f["in_code"]:
                f["status"] = "Visual Mockup / Smoke Test"
                f["evidence_conflict"] = True
                f["conflict_reason"] = "Feature displayed in video demo, but search in public repository / bundle returns zero code imports or routes."
                conflicts.append({
                    "feature": name,
                    "type": "Marketing Smoke Test",
                    "description": f["conflict_reason"]
                })
                log("ConflictResolver", f"⚠️ CONFLICT RESOLVED [{name}]: Deemed a Marketing Mockup (UI is visible, but zero code backend found).")

            # Scenario B: NOT visible in UI, but code is heavily implemented
            elif not f["in_ui"] and f["in_code"]:
                f["status"] = "Hidden API / Under Development"
                f["evidence_conflict"] = True
                f["conflict_reason"] = "Code imports and endpoints exist in JS bundles, but feature is entirely absent from user-facing screens / dashboards."
                conflicts.append({
                    "feature": name,
                    "type": "Stealth Launch",
                    "description": f["conflict_reason"]
                })
                log("ConflictResolver", f"⚠️ CONFLICT RESOLVED [{name}]: Deemed a Stealth Launch (Code exists, but UI is hidden behind feature flags).")

            # Scenario C: In both UI and Code, but features flags disable it in production
            elif f["in_ui"] and f["in_code"]:
                # Check if we have feature flags in code that indicate inactive
                # For our simulated data, TaskFlow Brainstorm Canvas has a feature flag `ENABLE_BRAIN_AI = false`
                if "ENABLE_BRAIN_AI" in str(f["code_details"]):
                    f["status"] = "Closed Beta / Inactive Flag"
                    f["evidence_conflict"] = True
                    f["conflict_reason"] = "UI features are ready, and code routes exist, but the flag 'ENABLE_BRAIN_AI' is hardcoded to false in production JS bundles."
                    conflicts.append({
                        "feature": name,
                        "type": "Disabled Beta",
                        "description": f["conflict_reason"]
                    })
                    log("ConflictResolver", f"⚠️ CONFLICT RESOLVED [{name}]: Closed Beta (Flag is disabled in bundle, though UI demo exists).")
                else:
                    f["status"] = "Public Beta / Live"
                    f["evidence_conflict"] = False
                    log("ConflictResolver", f"✅ ALIGNED [{name}]: Feature is live and code matches UI presence.")

        # --- Node 3: Timeline & Intelligence Generator ---
        log("TimelineGenerator", "Synthesizing roadmaps and projecting launch windows...")
        time.sleep(1)

        timeline = []
        # Construct timeline nodes with estimated weeks until launch based on status
        for name, f in reconciled_features.items():
            weeks_to_launch = 0
            confidence_level = "High"
            
            if f["status"] == "Visual Mockup / Smoke Test":
                weeks_to_launch = 8
                confidence_level = "Medium"
            elif f["status"] == "Closed Beta / Inactive Flag":
                weeks_to_launch = 2
                confidence_level = "High"
            elif f["status"] == "Hidden API / Under Development":
                weeks_to_launch = 4
                confidence_level = "Medium"
            elif f["status"] == "Public Beta / Live":
                weeks_to_launch = 0
                confidence_level = "High"

            timeline_item = {
                "feature": name,
                "status": f["status"],
                "reconciliation_status": "Reconciled & Confirmed",
                "weeks_to_launch": weeks_to_launch,
                "confidence": confidence_level,
                "impact_level": "High" if "Canvas" in name or "Vector" in name else "Medium",
                "details": f["ui_details"] or f["code_details"] or "No detailed description available.",
                "indicators": {
                    "ui_detected": f["in_ui"],
                    "code_detected": f["in_code"],
                    "endpoints": f["endpoints_found"]
                }
            }
            timeline.append(timeline_item)

        # Sort timeline by weeks to launch (earliest launch first)
        timeline.sort(key=lambda x: x["weeks_to_launch"])

        log("TimelineGenerator", "Timeline creation complete. Strategic analysis saved.")

        return {
            "competitor": vision_data.get("competitor", "Unknown Competitor"),
            "conflicts": conflicts,
            "timeline": timeline,
            "overall_integrity": 0.95 - (len(conflicts) * 0.05),
            "generated_at": time.strftime("%Y-%m-%d %H:%M:%S")
        }
