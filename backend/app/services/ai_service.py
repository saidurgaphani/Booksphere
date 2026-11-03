import os
import json
import re
from typing import List, Dict, Any, Optional
from app.utils.storage import read_json
from app.services.book_service import get_all_books, get_book_by_id
from app.models.schemas import BookRecommendation, RecommendationsResponse, BookAIInsightsResponse

CURATED_FALLBACK_RECOMMENDATIONS = [
    {
        "title": "Clear Thinking",
        "author": "Shane Parrish",
        "genre": "Self-Help",
        "description": "Turning ordinary moments into extraordinary results by recognizing when thinking is needed and avoiding common decision-making traps.",
        "estimated_pages": 288,
        "why_recommended": "Perfect companion to Atomic Habits and Deep Work, focusing on mental models, clear decision making, and habit architecture.",
        "key_themes": ["Decision Making", "Mental Models", "Self-Discipline"]
    },
    {
        "title": "Children of Time",
        "author": "Adrian Tchaikovsky",
        "genre": "Science Fiction",
        "description": "A sweeping epic about human survival on a terraformed world and the unexpected rise of an uplifted arachnid civilization.",
        "estimated_pages": 600,
        "why_recommended": "Ideal for fans of Andy Weir and hard science fiction, exploring first contact, evolution, and mutual survival.",
        "key_themes": ["Evolution", "First Contact", "Survival", "Societal Development"]
    },
    {
        "title": "Make Time",
        "author": "Jake Knapp & John Zeratsky",
        "genre": "Productivity",
        "description": "How to focus on what matters every day, written by the creators of Google Ventures Design Sprint.",
        "estimated_pages": 304,
        "why_recommended": "Practical framework that complements Deep Work with daily highlighting, laser mode, and energy restoration.",
        "key_themes": ["Time Management", "Focus", "Energy", "Digital Wellbeing"]
    },
    {
        "title": "Never Let Me Go",
        "author": "Kazuo Ishiguro",
        "genre": "Literary Fiction",
        "description": "A poignant, haunting dystopian novel centered on friendship, innocence, and what it truly means to be human in a fragile existence.",
        "estimated_pages": 288,
        "why_recommended": "Shares the delicate narrative voice, moral beauty, and philosophical depth of Klara and the Sun.",
        "key_themes": ["Identity", "Friendship", "Mortality", "Ethics"]
    },
    {
        "title": "Same as Ever",
        "author": "Morgan Housel",
        "genre": "Finance",
        "description": "A guide to what never changes in a world of constant flux, from risk perception to human desire and patience.",
        "estimated_pages": 240,
        "why_recommended": "Direct follow-up to The Psychology of Money, exploring historical patterns in human behavior and investment patience.",
        "key_themes": ["Human Behavior", "Risk", "History", "Patience"]
    },
    {
        "title": "Hyperion",
        "author": "Dan Simmons",
        "genre": "Science Fiction",
        "description": "On the eve of armageddon, seven pilgrims share their extraordinary journeys toward the mysterious Time Tombs of Hyperion.",
        "estimated_pages": 482,
        "why_recommended": "Grand space opera masterwork that balances literary storytelling with epic universe building like Dune.",
        "key_themes": ["Space Opera", "Time Travel", "Faith", "Artificial Intelligence"]
    },
    {
        "title": "Thinking, Fast and Slow",
        "author": "Daniel Kahneman",
        "genre": "Psychology",
        "description": "Nobel laureate Daniel Kahneman explains the two systems that drive the way we think—System 1 (fast/intuitive) and System 2 (slow/deliberative).",
        "estimated_pages": 499,
        "why_recommended": "Foundation for understanding cognitive biases, behavioural economics, and personal habits.",
        "key_themes": ["Cognitive Biases", "Rationality", "Behavioral Economics"]
    },
    {
        "title": "The Three-Body Problem",
        "author": "Cixin Liu",
        "genre": "Science Fiction",
        "description": "Set against China's Cultural Revolution, a secret military project sends signals into space, leading to an impending alien crisis.",
        "estimated_pages": 400,
        "why_recommended": "Mind-expanding hard sci-fi exploring physics, astronomy, and planetary civilizations.",
        "key_themes": ["Physics", "Cosmology", "Civilization", "Game Theory"]
    }
]

def get_gemini_api_key() -> Optional[str]:
    # 1. From settings.json
    settings = read_json("settings.json", default={})
    key = settings.get("gemini_api_key", "").strip()
    if key:
        return key
    # 2. From environment
    env_key = os.getenv("GEMINI_API_KEY", "").strip()
    if env_key:
        return env_key
    return None

def get_recommendations(
    favorite_genres: Optional[List[str]] = None,
    custom_prompt: Optional[str] = None,
    count: int = 4
) -> RecommendationsResponse:
    user_books = get_all_books()
    user_genres = list(set([b.get("genre") for b in user_books if b.get("genre")]))
    user_reading = [b.get("title") for b in user_books if b.get("status") == "reading"]
    user_completed = [b.get("title") for b in user_books if b.get("status") == "completed"]
    
    target_genres = favorite_genres or user_genres or ["Science Fiction", "Self-Help", "Productivity"]
    
    api_key = get_gemini_api_key()
    
    if api_key:
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            
            prompt = f"""You are an expert literary curator and reading assistant for BookSphere.
Generate {count} real, highly-regarded book recommendations tailored to the reader.

User Context:
- Favorite / Preferred Genres: {", ".join(target_genres)}
- Currently Reading: {", ".join(user_reading) if user_reading else "None"}
- Previously Completed: {", ".join(user_completed) if user_completed else "None"}
- Custom Reader Request: {custom_prompt or "None provided"}

Do NOT recommend books that the user is already reading or has completed.
Ensure all books are real, published books.

Return ONLY a valid JSON array of objects with the exact keys:
[
  {{
    "title": "Title of the Book",
    "author": "Author Name",
    "genre": "Genre",
    "description": "Concise 2-3 sentence overview of the book's premise.",
    "estimated_pages": 320,
    "why_recommended": "Specific 2-3 sentence explanation connecting this book to the reader's tastes and existing library.",
    "key_themes": ["Theme1", "Theme2", "Theme3"]
  }}
]
"""
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            raw_text = response.text.strip()
            
            # Clean markdown codeblocks if present
            cleaned = re.sub(r"^```(?:json)?\s*", "", raw_text)
            cleaned = re.sub(r"\s*```$", "", cleaned)
            
            data = json.loads(cleaned)
            recommendations = []
            for item in data[:count]:
                recommendations.append(BookRecommendation(
                    title=item.get("title", "Untitled"),
                    author=item.get("author", "Unknown"),
                    genre=item.get("genre", "General"),
                    description=item.get("description", ""),
                    estimated_pages=item.get("estimated_pages", 300),
                    why_recommended=item.get("why_recommended", "Matches your literary interests."),
                    key_themes=item.get("key_themes", []),
                    ai_generated=True,
                    fallback=False
                ))
                
            return RecommendationsResponse(
                recommendations=recommendations,
                source="gemini",
                message="Personalized recommendations dynamically synthesized by Gemini 2.5 Flash."
            )
        except Exception as e:
            print(f"Gemini API error, falling back to curated engine: {e}")

    # Fallback mode (deterministic, genre-aware)
    filtered = []
    # Match by target genres
    lower_targets = [g.lower() for g in target_genres]
    for c in CURATED_FALLBACK_RECOMMENDATIONS:
        # Avoid recommending books already in library
        if any(b.get("title", "").lower() == c["title"].lower() for b in user_books):
            continue
        if any(t in c["genre"].lower() for t in lower_targets):
            filtered.append(c)
            
    # If not enough, append remaining non-duplicate curated books
    for c in CURATED_FALLBACK_RECOMMENDATIONS:
        if len(filtered) >= count:
            break
        if c not in filtered and not any(b.get("title", "").lower() == c["title"].lower() for b in user_books):
            filtered.append(c)
            
    recs = []
    for f in filtered[:count]:
        recs.append(BookRecommendation(
            title=f["title"],
            author=f["author"],
            genre=f["genre"],
            description=f["description"],
            estimated_pages=f.get("estimated_pages", 300),
            why_recommended=f["why_recommended"],
            key_themes=f["key_themes"],
            ai_generated=True,
            fallback=True
        ))
        
    return RecommendationsResponse(
        recommendations=recs,
        source="curated_fallback",
        message="Active in Offline / Curated Fallback mode. Add your Gemini API key in Settings to unlock dynamic generative recommendations."
    )

def generate_book_ai_insights(book_id: str) -> Optional[BookAIInsightsResponse]:
    book = get_book_by_id(book_id)
    if not book:
        return None
        
    title = book.get("title")
    author = book.get("author")
    genre = book.get("genre")
    description = book.get("description", "")
    
    api_key = get_gemini_api_key()
    if api_key:
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            prompt = f"""Provide deep reading insights for this book:
Title: {title}
Author: {author}
Genre: {genre}
Description: {description}

Return ONLY valid JSON with this exact structure:
{{
  "summary": "Concise 3-4 sentence core thesis and narrative summary.",
  "key_takeaways": [
    "Takeaway 1",
    "Takeaway 2",
    "Takeaway 3"
  ],
  "discussion_questions": [
    "Thought-provoking question 1",
    "Thought-provoking question 2",
    "Thought-provoking question 3"
  ],
  "reflection_prompt": "A personal reflective prompt for the reader to journal on."
}}
"""
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            cleaned = re.sub(r"^```(?:json)?\s*", "", response.text.strip())
            cleaned = re.sub(r"\s*```$", "", cleaned)
            data = json.loads(cleaned)
            
            return BookAIInsightsResponse(
                book_id=book_id,
                title=title,
                summary=data.get("summary", f"A pivotal exploration of {genre} by {author}."),
                key_takeaways=data.get("key_takeaways", []),
                discussion_questions=data.get("discussion_questions", []),
                reflection_prompt=data.get("reflection_prompt", "How does this book change your perspective?"),
                source="gemini"
            )
        except Exception as e:
            print(f"Gemini error generating book insights: {e}")

    # Fallback book insights
    return BookAIInsightsResponse(
        book_id=book_id,
        title=title,
        summary=f"'{title}' by {author} is a celebrated work in the {genre} domain. It examines fundamental human instincts, structural discipline, and transformative world-building.",
        key_takeaways=[
            f"Core conceptual models presented by {author} focus on intentional progress and awareness.",
            "Gradual compounding effects create dramatic differences over extended horizons.",
            "Challenging environmental assumptions unlocks new pathways for resilience and focus."
        ],
        discussion_questions=[
            f"How does the central dilemma in '{title}' reflect modern societal challenges?",
            f"Which character or concept in {title} resonated most with your personal experiences?",
            "What habits or beliefs did this book prompt you to reconsider?"
        ],
        reflection_prompt=f"If you could implement one core lesson from '{title}' starting tomorrow morning, what concrete step would you take?",
        source="curated_fallback"
    )

