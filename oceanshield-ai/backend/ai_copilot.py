"""
AI Copilot: Generates contextual reports using LLM integration.
Placeholder for OpenAI/Anthropic SDK calls.
"""

import json
from typing import Dict, Any, Optional
# import openai  # Placeholder - install with: pip install openai

# Set your API key here (in production, use environment variables)
# openai.api_key = "your-openai-api-key"

def generate_copilot_report(
    mode: str,
    evs_score: float,
    active_cascades: List[Dict[str, Any]],
    current_params: Dict[str, Any]
) -> str:
    """
    Generate a contextual AI report based on current system state.

    Args:
        mode: Report mode ("Scientist", "Policy", or "Fisherman")
        evs_score: Current EVS score (0-100)
        active_cascades: List of active cascade scenarios
        current_params: Current environmental parameters

    Returns:
        Generated report text
    """

    # Define mode-specific contexts
    mode_contexts = {
        "Scientist": {
            "perspective": "marine biologist/ecologist",
            "focus": "scientific analysis and ecological impacts",
            "language": "technical, data-driven"
        },
        "Policy": {
            "perspective": "environmental policy advisor",
            "focus": "regulatory implications and mitigation strategies",
            "language": "policy-oriented, actionable"
        },
        "Fisherman": {
            "perspective": "commercial fisherman",
            "focus": "economic impacts and fishing operations",
            "language": "practical, industry-focused"
        }
    }

    context = mode_contexts.get(mode, mode_contexts["Scientist"])

    # Build prompt with current state
    prompt = f"""
You are an AI copilot for OceanShield, acting as a {context['perspective']}.
Generate a concise warning report (2-3 paragraphs) about the current ocean ecosystem state.

Current System State:
- EVS Score: {evs_score:.1f}/100 ({'Critical' if evs_score > 75 else 'High' if evs_score > 50 else 'Moderate' if evs_score > 25 else 'Low'} Risk)
- Active Cascade Threats: {len(active_cascades)}
- Environmental Parameters: {json.dumps(current_params, indent=2)}

{f'Active Cascades: {json.dumps(active_cascades, indent=2)}' if active_cascades else 'No active cascade threats detected.'}

Focus on {context['focus']}.
Use {context['language']} language.
Provide specific recommendations based on the current threats.
Keep the report under 300 words.
"""

    # Placeholder for LLM call - replace with actual API call
    try:
        # Uncomment and configure when API key is available
        # response = openai.ChatCompletion.create(
        #     model="gpt-4",
        #     messages=[{"role": "user", "content": prompt}],
        #     max_tokens=300,
        #     temperature=0.7
        # )
        # return response.choices[0].message.content.strip()

        # Placeholder response for now
        return generate_mock_report(mode, evs_score, active_cascades, context)

    except Exception as e:
        # Fallback to mock response
        return f"Error generating AI report: {str(e)}. Using fallback analysis."

def generate_mock_report(mode: str, evs_score: float, active_cascades: List[Dict[str, Any]], context: Dict[str, str]) -> str:
    """Generate a mock report for development/testing purposes."""

    base_report = f"""
As a {context['perspective']}, I assess the current EVS score of {evs_score:.1f}/100 indicates {'severe' if evs_score > 75 else 'significant' if evs_score > 50 else 'moderate'} ecosystem stress.

{f'There are {len(active_cascades)} active cascade threats requiring immediate attention.' if active_cascades else 'No critical cascade threats are currently active, but monitoring should continue.'}

From a {context['focus']} perspective, I recommend:
- Continuous monitoring of environmental parameters
- Implementation of adaptive management strategies
- Stakeholder coordination for threat mitigation
"""

    if mode == "Scientist":
        base_report += "\n\nScientifically, the compound stress indicators suggest potential phase shifts in marine ecosystem dynamics. Further research into stressor interactions is warranted."
    elif mode == "Policy":
        base_report += "\n\nPolicy-wise, this situation may require regulatory interventions including emission controls and protected area designations."
    elif mode == "Fisherman":
        base_report += "\n\nFor fishing operations, consider seasonal adjustments and alternative fishing grounds to minimize economic impacts."

    return base_report.strip()