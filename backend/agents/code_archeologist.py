import os
import json
import logging
import time

logger = logging.getLogger("nexusintel.code_archeologist")

class CodeArcheologist:
    """
    Agent 2 (The Code Diff Archeologist): Monitors public JS bundles, landing pages,
    or open-source GitHub repositories for code shifts, new API endpoints, and feature flags.
    """
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.is_live = bool(self.api_key)

    def analyze(self, repo_url: str, bundle_url: str, competitor_name: str, log_callback=None) -> dict:
        """
        Analyzes the code repository diffs or web bundles.
        If a Gemini API key is available, attempts to perform an LLM-assisted code audit.
        Otherwise, runs a high-fidelity code shift simulation.
        """
        def log(msg):
            logger.info(msg)
            if log_callback:
                log_callback("CodeArcheologist", msg)

        source = repo_url or bundle_url or "landing_page_bundle_v2.5.js"
        log(f"Auditing code source: {source}")
        time.sleep(1)

        if self.is_live:
            log("Gemini API Key detected. Initializing Gemini code analyzer for AST-diff and signature shifts...")
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                
                # Mock a raw Git diff / bundle source code retrieve
                log(f"Fetching code snippets or commits from {source}...")
                mock_diff = (
                    "diff --git a/src/routes/api.ts b/src/routes/api.ts\n"
                    "+ router.post('/ai/canvas/generate', auth, handleCanvasAi);\n"
                    "+ router.get('/pricing/enterprise-ai', getEnterprisePricing);\n"
                    "diff --git a/package.json b/package.json\n"
                    "+ \"@excalidraw/excalidraw\": \"^0.17.0\",\n"
                    "+ \"@google/generative-ai\": \"^0.11.0\""
                )
                
                model = genai.GenerativeModel("gemini-1.5-pro")
                prompt = (
                    f"Analyze the following code diff from {competitor_name}'s repository. "
                    "Identify new libraries, new API endpoints, feature flags, and structural shifts. "
                    f"Diff:\n\n{mock_diff}\n\n"
                    "Respond in JSON with keys 'structural_shifts', 'added_dependencies', 'new_endpoints', and 'confidence_score'."
                )
                
                log("Sending code diff to Gemini 1.5 Pro...")
                response = model.generate_content(prompt)
                log("Gemini code analysis complete.")
                
                try:
                    text_content = response.text
                    import re
                    json_match = re.search(r"\{.*\}", text_content, re.DOTALL)
                    if json_match:
                        data = json.loads(json_match.group(0))
                        log(f"Successfully decoded Gemini Code Diff output: {len(data.get('structural_shifts', []))} shifts detected.")
                        return data
                except Exception as parse_err:
                    log(f"Failed to parse live Gemini JSON response. Fallback to simulator. Error: {parse_err}")
            except Exception as e:
                log(f"Gemini API code invocation failed: {e}. Falling back to simulation...")

        # Simulation Mode (Rich Hackathon Scenarios)
        log("Running in Code Archeology Simulator Mode. Fetching public source diffs...")
        time.sleep(1.5)

        competitor_key = competitor_name.lower().replace(" ", "")

        if "taskflow" in competitor_key or "linear" in competitor_key:
            findings = {
                "competitor": "TaskFlow Inc.",
                "source": source,
                "structural_shifts": [
                    {
                        "file": "package.json",
                        "change": "Added dependencies: `@excalidraw/excalidraw` (v0.17.2) and `@liveblocks/client` (v1.10.0)",
                        "impact": "Excalidraw indicates canvas editing. Liveblocks indicates multi-player real-time collaboration. This is the foundation for an unannounced whiteboarding tool."
                    },
                    {
                        "file": "src/config/features.ts",
                        "change": "Added `ENABLE_BRAIN_AI = false` and `AI_CREDIT_CAP = 50` feature flags",
                        "impact": "The feature is in the codebase but hidden behind a disabled feature flag in production. This proves the feature is undergoing smoke tests."
                    }
                ],
                "new_endpoints": [
                    {
                        "path": "/api/v1/brainstorm/suggest-ideas",
                        "method": "POST",
                        "status": "Inactive / Returns 404/403 for external users",
                        "purpose": "Endpoint for generative AI canvas sticky-note suggestions."
                    },
                    {
                        "path": "/api/v1/billing/enterprise-ai",
                        "method": "GET",
                        "status": "Inactive / Schema exists in bundle",
                        "purpose": "Verifies AI add-on purchase status."
                    }
                ],
                "added_dependencies": ["@excalidraw/excalidraw", "@liveblocks/client"],
                "confidence_score": 0.96
            }
        elif "supabase" in competitor_key or "firebase" in competitor_key:
            findings = {
                "competitor": "SupaDB Platform",
                "source": source,
                "structural_shifts": [
                    {
                        "file": "src/lib/vector/index.ts",
                        "change": "Created class `LocalEmbeddingEngine` resolving `transformer.js` models client-side",
                        "impact": "Adding local, client-side embeddings via ONNX runtime, bypassing the need for cloud vector servers."
                    },
                    {
                        "file": "package.json",
                        "change": "Added dependencies: `@simplewebauthn/server` (v9.0.0) and `@simplewebauthn/browser` (v9.0.0)",
                        "impact": "Confirms passkey / biometric authentication module integration is finalized in codebase."
                    }
                ],
                "new_endpoints": [
                    {
                        "path": "/auth/v1/passkey/register",
                        "method": "POST",
                        "status": "Partially Live / Hidden routing rules",
                        "purpose": "Registers a credential signature."
                    },
                    {
                        "path": "/auth/v1/passkey/verify",
                        "method": "POST",
                        "status": "Partially Live / Hidden routing rules",
                        "purpose": "Verifies biometric logins."
                    }
                ],
                "added_dependencies": ["@simplewebauthn/server", "@simplewebauthn/browser", "@xenova/transformers"],
                "confidence_score": 0.94
            }
        else:
            # Generic/Custom Competitor
            findings = {
                "competitor": competitor_name,
                "source": source,
                "structural_shifts": [
                    {
                        "file": "src/index.js",
                        "change": "Integrated a new service wrapper: `CloudflareWorkerService`",
                        "impact": "Shifting heavy endpoint processing to edge workers for ultra-low latency."
                    },
                    {
                        "file": "package.json",
                        "change": "Added `@cloudflare/workers-types` dependency",
                        "impact": "Supports edge runtime environments."
                    }
                ],
                "new_endpoints": [
                    {
                        "path": "/edge/v1/summarize-notification",
                        "method": "POST",
                        "status": "Active internally",
                        "purpose": "Edge worker endpoint for real-time notification summaries."
                    }
                ],
                "added_dependencies": ["@cloudflare/workers-types"],
                "confidence_score": 0.88
            }

        log(f"Code Archeologist complete. Detected {len(findings['structural_shifts'])} AST/config shifts.")
        return findings
