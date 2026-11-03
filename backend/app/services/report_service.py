import csv
import io
from datetime import datetime, timezone
from app.services.book_service import get_all_books
from app.services.stats_service import get_dashboard_statistics, get_insights_statistics
from app.services.progress_service import get_reading_history

def generate_csv_report() -> str:
    books = get_all_books()
    stats = get_dashboard_statistics()
    history = get_reading_history()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header summary
    writer.writerow(["BOOKSPHERE READING REPORT"])
    writer.writerow(["Generated At", datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")])
    writer.writerow([])
    
    # Statistics Summary
    writer.writerow(["--- READING STATISTICS ---"])
    writer.writerow(["Metric", "Value"])
    writer.writerow(["Total Books", stats["total_books"]])
    writer.writerow(["Currently Reading", stats["currently_reading"]])
    writer.writerow(["Completed Books", stats["completed_books"]])
    writer.writerow(["Want to Read", stats["planned_books"]])
    writer.writerow(["Total Pages Read", stats["total_pages_read"]])
    writer.writerow(["Total Library Pages", stats["total_library_pages"]])
    writer.writerow(["Overall Completion Rate (%)", stats["overall_progress_percentage"]])
    writer.writerow([])
    
    # Books Table
    writer.writerow(["--- BOOK COLLECTION ---"])
    writer.writerow(["ID", "Title", "Author", "Genre", "Status", "Current Page", "Total Pages", "Progress (%)", "Rating", "Date Added", "Date Completed"])
    for b in books:
        writer.writerow([
            b.get("id"),
            b.get("title"),
            b.get("author"),
            b.get("genre"),
            b.get("status"),
            b.get("current_page", 0),
            b.get("total_pages", 0),
            b.get("completion_percentage", 0),
            b.get("rating") or "N/A",
            b.get("date_added", ""),
            b.get("date_completed") or "N/A"
        ])
    writer.writerow([])
    
    # History Table
    writer.writerow(["--- READING HISTORY LOG ---"])
    writer.writerow(["Timestamp", "Book Title", "Previous Page", "New Page", "Pages Read", "Session Note"])
    for h in history:
        writer.writerow([
            h.get("timestamp"),
            h.get("book_title"),
            h.get("previous_page"),
            h.get("new_page"),
            h.get("pages_read"),
            h.get("note") or ""
        ])
        
    return output.getvalue()

def generate_txt_report() -> str:
    books = get_all_books()
    stats = get_dashboard_statistics()
    insights = get_insights_statistics()
    history = get_reading_history()
    now_str = datetime.now(timezone.utc).strftime("%B %d, %Y - %H:%M UTC")
    
    lines = []
    lines.append("=" * 70)
    lines.append("                   BOOKSPHERE - READING REPORT")
    lines.append("               AI-Driven Personal Reading Companion")
    lines.append(f"               Generated: {now_str}")
    lines.append("=" * 70)
    lines.append("")
    
    # 1. Executive Summary
    lines.append("1. READING OVERVIEW & METRICS")
    lines.append("-" * 70)
    lines.append(f"  Total Books in Collection : {stats['total_books']}")
    lines.append(f"  Currently Reading         : {stats['currently_reading']}")
    lines.append(f"  Books Completed           : {stats['completed_books']}")
    lines.append(f"  Planned / Want to Read    : {stats['planned_books']}")
    lines.append(f"  Total Pages Read          : {stats['total_pages_read']} / {stats['total_library_pages']} pages")
    lines.append(f"  Overall Progress Rate     : {stats['overall_progress_percentage']}%")
    lines.append(f"  Current Reading Streak    : {insights['reading_streak_days']} days")
    lines.append(f"  Average Pages Per Session : {insights['average_pages_per_session']} pages")
    lines.append(f"  Reading Pace Status       : {insights['reading_pace_status']}")
    lines.append("")
    
    # 2. Currently Reading
    lines.append("2. CURRENTLY ACTIVE BOOKS")
    lines.append("-" * 70)
    reading_books = [b for b in books if b.get("status") == "reading"]
    if not reading_books:
        lines.append("  No active books currently being read.")
    else:
        for b in reading_books:
            lines.append(f"  * {b.get('title')} by {b.get('author')}")
            lines.append(f"    Progress: {b.get('current_page')}/{b.get('total_pages')} pages ({b.get('completion_percentage')}%) | Genre: {b.get('genre')}")
    lines.append("")
    
    # 3. Completed Books
    lines.append("3. COMPLETED BOOKS")
    lines.append("-" * 70)
    completed_books = [b for b in books if b.get("status") == "completed"]
    if not completed_books:
        lines.append("  No completed books recorded yet.")
    else:
        for b in completed_books:
            rating_str = f" | Rating: {'★' * b.get('rating')}" if b.get('rating') else ""
            comp_date = b.get('date_completed') or "Recorded"
            lines.append(f"  [✓] {b.get('title')} - {b.get('author')} ({b.get('total_pages')} pages){rating_str}")
            lines.append(f"      Genre: {b.get('genre')} | Completed: {comp_date[:10] if 'T' in comp_date else comp_date}")
    lines.append("")
    
    # 4. Planned Books
    lines.append("4. UPCOMING / WANT TO READ")
    lines.append("-" * 70)
    planned = [b for b in books if b.get("status") == "want_to_read"]
    if not planned:
        lines.append("  No books on the reading wishlist.")
    else:
        for b in planned:
            lines.append(f"  - {b.get('title')} by {b.get('author')} ({b.get('genre')}, ~{b.get('total_pages')} pages)")
    lines.append("")
    
    # 5. Recent Reading History
    lines.append("5. RECENT READING ACTIVITY LOG")
    lines.append("-" * 70)
    if not history:
        lines.append("  No reading sessions recorded yet.")
    else:
        for h in history[:10]:
            ts = h.get('timestamp', '')[:10]
            lines.append(f"  [{ts}] {h.get('book_title')} : Read {h.get('pages_read')} pages (now on p. {h.get('new_page')})")
            if h.get('note'):
                lines.append(f"         Note: \"{h.get('note')}\"")
    lines.append("")
    lines.append("=" * 70)
    lines.append("                     END OF REPORT")
    lines.append("=" * 70)
    
    return "\n".join(lines)

