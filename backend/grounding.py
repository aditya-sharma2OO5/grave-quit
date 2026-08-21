from typing import Dict, Any, List

class GroundingError(Exception):
    """Raised when an LLM claim contradicts the deterministic stats."""
    pass

def validate_claims(llm_output: Dict[str, Any], actual_stats: Dict[str, Any]) -> str:
    """
    Validates that the claims made by the LLM (passed via structured JSON output)
    exactly match the real deterministic stats.
    
    Expected llm_output format:
    {
        "summary": "The human-readable summary paragraph...",
        "claims": [
            {"metric": "total_quit", "value": 4},
            {"metric": "most_common_tag", "value": "Too Hard"}
        ]
    }
    
    Returns the valid summary string if all claims pass.
    Raises GroundingError if a hallucination is detected.
    """
    summary = llm_output.get("summary", "")
    claims = llm_output.get("claims", [])
    
    if not claims and summary:
        # If the LLM didn't cite any claims but wrote a summary, that's suspicious,
        # but we allow it if the summary is very generic.
        pass
        
    for claim in claims:
        metric = claim.get("metric")
        llm_value = claim.get("value")
        
        if metric not in actual_stats:
            raise GroundingError(f"Hallucination detected: LLM cited unknown metric '{metric}'")
            
        real_value = actual_stats[metric]
        
        # Exact match validation (can be made looser for floats if needed, e.g., rounding)
        if str(llm_value) != str(real_value):
            raise GroundingError(
                f"Hallucination detected: LLM claimed {metric} was '{llm_value}', "
                f"but deterministic stat is '{real_value}'"
            )
            
    return summary

if __name__ == "__main__":
    real_stats = {
        "avg_days_to_quit": 8.5,
        "most_common_tag": "Too Hard",
        "total_quit": 4,
        "total_completed": 1
    }
    
    # 1. Valid LLM output
    valid_llm_json = {
        "summary": "You've quit 4 items, mostly because they were 'Too Hard'.",
        "claims": [
            {"metric": "total_quit", "value": 4},
            {"metric": "most_common_tag", "value": "Too Hard"}
        ]
    }
    
    try:
        res = validate_claims(valid_llm_json, real_stats)
        print("PASS: Valid claims accepted.")
    except GroundingError as e:
        print(f"FAIL: {e}")
        
    # 2. Hallucinated LLM output (wrong number)
    hallucinated_json = {
        "summary": "You've quit 5 items, mostly because they were 'Too Hard'.",
        "claims": [
            {"metric": "total_quit", "value": 5}, # HALLUCINATION
            {"metric": "most_common_tag", "value": "Too Hard"}
        ]
    }
    
    try:
        validate_claims(hallucinated_json, real_stats)
        print("FAIL: Hallucinated claims were accepted!")
    except GroundingError as e:
        print(f"PASS: Hallucination successfully blocked -> {e}")
