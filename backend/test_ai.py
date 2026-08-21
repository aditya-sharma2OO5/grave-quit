from ai_summary import generate_pattern_summary

def test_prompt():
    stats = {
        "avg_days_to_quit": 8.5,
        "most_common_tag": "Too Hard",
        "total_quit": 4,
        "total_completed": 1
    }
    reasons = [
        "the math got way too advanced",
        "couldnt keep up with the weekly assignments"
    ]
    
    print("Testing AI Summary Generation (Warning: needs valid ANTHROPIC_API_KEY)...\n")
    summary = generate_pattern_summary(stats, reasons)
    print("Resulting Summary:")
    print("------------------")
    print(summary)
    print("------------------")

if __name__ == "__main__":
    test_prompt()
