import os
from groq import Groq
from typing import Dict, List, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY", "fallback_key"))

def generate_pattern_summary(stats: Dict[str, Any], recent_reasons: List[str]) -> str:
    """
    Generates a grounded plain-language summary of quitting patterns based strictly
    on deterministic statistics using Groq.
    
    stats: output of compute_stats()
    recent_reasons: up to ~5 most recent reason_text strings
    """
    if stats["total_quit"] == 0:
        return "You haven't paused or let go of any items yet. Once you do, your patterns will appear here."
 
    reasons_block = "\n".join(f"- {r}" for r in recent_reasons) if recent_reasons else "(no free-text reasons given)"
 
    prompt = f"""You are summarizing a student's self-tracked quitting pattern.
Use ONLY the numbers and quotes given below. Do not invent statistics,
do not speculate about causes not stated, do not moralize or use
guilt-inducing language. Keep it to 2-3 sentences, warm and neutral,
like a curious observation rather than a judgment.

Computed stats:
- Average days before quitting: {stats['avg_days_to_quit']}
- Most common stated reason: {stats['most_common_tag']}
- Total items quit: {stats['total_quit']}
- Total items completed: {stats['total_completed']}

Recent reasons in the student's own words:
{reasons_block}

Write the summary now."""
 
    try:
        response = client.chat.completions.create(
            model="qwen/qwen3.6-27b",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200
        )
        return response.choices[0].message.content
    except Exception as e:
        # Fallback if API fails (e.g. invalid key)
        return f"You've let go of {stats['total_quit']} items, usually citing '{stats['most_common_tag']}' after an average of {stats['avg_days_to_quit']} days."
