import re
import json
from collections import defaultdict, Counter
from datetime import datetime, timedelta
import emoji

# --------------------------
# CONFIG - EXPANDED TOPICS
# --------------------------
TOPIC_KEYWORDS = {
    "jobs_career": ["job", "hiring", "vacancy", "opportunity", "resume", "interview", "career", "salary", "work", "employment"],
    "python_dev": ["python", "django", "flask", "fastapi", "pip", "virtualenv", "pytest", "async", "decorator"],
    "web_dev": ["javascript", "react", "vue", "angular", "html", "css", "frontend", "backend", "api", "rest"],
    "blockchain": ["solana", "web3", "nft", "crypto", "blockchain", "ethereum", "bitcoin", "defi", "smart contract"],
    "data_science": ["pandas", "numpy", "machine learning", "ai", "data", "analysis", "model", "dataset", "visualization"],
    "mobile_dev": ["android", "ios", "flutter", "react native", "swift", "kotlin", "mobile app"],
    "devops": ["docker", "kubernetes", "aws", "azure", "cloud", "ci/cd", "jenkins", "deployment", "server"],
    "business_startup": ["startup", "business", "entrepreneur", "funding", "investor", "product", "market", "revenue"],
    "learning": ["tutorial", "learn", "course", "documentation", "beginner", "guide", "how to", "explain"],
    "help_support": ["help", "error", "bug", "issue", "problem", "stuck", "question", "anyone know"],
}

QUESTION_MARKERS = ["?", "what", "how", "why", "when", "who", "can someone", "does anyone", "help"]
HELPING_INDICATORS = ["try this", "you can", "here's how", "check out", "i suggest", "you should", "have you tried"]

# --------------------------
# PARSE WHATSAPP MESSAGES
# --------------------------
def parse_line(line):
    pattern = re.compile(r'^(\d{1,2}/\d{1,2}/\d{2}), (\d{1,2}:\d{2}(?:\u202f[AP]M| [AP]M)) - ([^:]+):?(.*)$')
    skip_patterns = [
        'end-to-end encrypted', 'created group', 'joined', 'changed to',
        'joined using this group\'s invite link', 'left', 'added', 'removed',
        'requested', 'changed', 'Membersinthisgrouparenowcommunitymembers',
        'Anyoneinthecommunity', 'Newmembersneedadminapprovaltojointhisgroup.Taptochange.'
    ]
    
    if not line or any(skip in line for skip in skip_patterns):
        return None
    
    match = pattern.match(line)
    if not match:
        return None
    
    date_str, time_str, sender, message = match.groups()
    try:
        date = datetime.strptime(date_str, '%m/%d/%y')
    except ValueError:
        try:
            date = datetime.strptime(date_str, '%d/%m/%y')
        except ValueError:
            return None
    try:
        time = datetime.strptime(time_str, '%I:%M %p')
    except ValueError:
        try:
            time = datetime.strptime(time_str.replace('\u202f', ' '), '%I:%M %p')
        except ValueError:
            return None
    
    return {
        "sender": sender.strip(),
        "message": message.strip(),
        "datetime": datetime.combine(date.date(), time.time())
    }

# --------------------------
# FORMAT NIGERIAN PHONE NUMBER
# --------------------------
def format_nigerian_number(sender):
    """
    Format Nigerian phone numbers to standard format: 09012345678
    Handles: +234, 234, 0, and raw numbers
    """
    # Remove all spaces and special characters except +
    clean = re.sub(r'[^\d+]', '', sender)
    
    # If it starts with +234 or 234
    if clean.startswith('+234'):
        return '0' + clean[4:]
    elif clean.startswith('234'):
        return '0' + clean[3:]
    # If it starts with 0 and is 11 digits
    elif clean.startswith('0') and len(clean) == 11:
        return clean
    # If it's 10 digits (missing leading 0)
    elif len(clean) == 10 and clean[0] in ['7', '8', '9']:
        return '0' + clean
    # If it has country code without +
    elif len(clean) == 13 and clean.startswith('234'):
        return '0' + clean[3:]
    
    # Return original if can't determine format
    return sender

# --------------------------
# CALCULATE STREAKS
# --------------------------
def calculate_streaks(dates):
    """Calculate longest and current streak from list of dates"""
    if not dates:
        return 0, 0
    
    unique_dates = sorted(set(dates))
    
    if len(unique_dates) == 1:
        return 1, 1
    
    longest_streak = 1
    temp_streak = 1
    
    for i in range(1, len(unique_dates)):
        if (unique_dates[i] - unique_dates[i-1]).days == 1:
            temp_streak += 1
        else:
            longest_streak = max(longest_streak, temp_streak)
            temp_streak = 1
    
    longest_streak = max(longest_streak, temp_streak)
    
    last_date = unique_dates[-1]
    current_streak = 1
    
    for i in range(len(unique_dates) - 2, -1, -1):
        if (last_date - unique_dates[i]).days == current_streak:
            current_streak += 1
        else:
            break
    
    return longest_streak, current_streak

# --------------------------
# DETECT TOPICS IN MESSAGE
# --------------------------
def detect_topics(message):
    """Detect which topics are mentioned in a message"""
    message_lower = message.lower()
    detected = []
    
    for topic, keywords in TOPIC_KEYWORDS.items():
        if any(keyword in message_lower for keyword in keywords):
            detected.append(topic)
    
    return detected

# --------------------------
# DETECT HELPING BEHAVIOR
# --------------------------
def is_helping(message):
    """Check if message shows helping behavior"""
    message_lower = message.lower()
    return any(indicator in message_lower for indicator in HELPING_INDICATORS)

# --------------------------
# DETERMINE ACTIVITY LEVEL
# --------------------------
def determine_activity_level(total_messages, total_days_active, longest_streak, avg_msgs_per_active_day, percentile):
    """
    Determine user's activity level and role in the group
    Returns: (level, description)
    """
    
    # Super active core members
    if total_messages >= 500 and percentile >= 80 and longest_streak >= 14:
        return "core_legend", "Core Legend 👑"
    
    if total_messages >= 300 and percentile >= 70:
        return "super_active", "Super Active Member 🌟"
    
    # Regular active members
    if total_messages >= 150 and total_days_active >= 30:
        return "very_active", "Very Active Member ⚡"
    
    if total_messages >= 80 and total_days_active >= 20:
        return "active", "Active Member 💪"
    
    # Moderate participants
    if total_messages >= 40 and total_days_active >= 10:
        return "regular", "Regular Member 👍"
    
    if total_messages >= 20:
        return "occasional", "Occasional Visitor 🌙"
    
    # Less active
    if total_messages >= 10:
        return "lurker", "Silent Observer �👀"
    
    if total_messages >= 5:
        return "ghost", "Ghost Member 👻"
    
    # Very minimal
    return "rare_sighting", "Rare Sighting 🦄"

# --------------------------
# DETERMINE USER ROLE
# --------------------------
def determine_user_role(stats):
    """
    Determine user's role based on their behavior patterns
    Can have multiple roles
    """
    roles = []
    
    # Helper/Mentor
    if stats['helping_messages'] >= 20 or (stats['helping_messages'] >= 10 and stats['total_messages'] < 100):
        roles.append({"role": "helper", "title": "The Helper 🦸", "description": "Always ready to assist others"})
    
    # Knowledge Seeker
    if stats['question_messages'] >= 30 or (stats['question_messages'] >= 15 and stats['total_messages'] < 100):
        roles.append({"role": "seeker", "title": "Knowledge Seeker 🔍", "description": "Curious and always learning"})
    
    # Conversation Starter
    if stats['conversation_starters'] >= 40:
        roles.append({"role": "starter", "title": "Conversation Starter 💡", "description": "Keeps the chat alive"})
    
    # Link Curator
    if stats['total_links'] >= 30:
        roles.append({"role": "curator", "title": "Link Curator 🔗", "description": "Shares valuable resources"})
    
    # Media Enthusiast
    if stats['total_media'] >= 30:
        roles.append({"role": "media_lover", "title": "Media Enthusiast 📸", "description": "Pictures speak louder"})
    
    # Night Owl
    if stats['night_owl_messages'] >= 50 or (stats['night_owl_messages'] / stats['total_messages'] > 0.4):
        roles.append({"role": "night_owl", "title": "Night Owl 🦉", "description": "Owns the late-night shift"})
    
    # Early Bird
    if stats['early_bird_messages'] >= 50 or (stats['early_bird_messages'] / stats['total_messages'] > 0.4):
        roles.append({"role": "early_bird", "title": "Early Bird 🌅", "description": "Morning motivation champion"})
    
    # Weekend Warrior
    if stats['weekend_messages'] >= 50 or (stats['weekend_messages'] / stats['total_messages'] > 0.5):
        roles.append({"role": "weekend_warrior", "title": "Weekend Warrior ⚔️", "description": "Weekends are for chatting"})
    
    # Emoji Expert
    if stats['total_emojis'] >= 100:
        roles.append({"role": "emoji_master", "title": "Emoji Master 😎", "description": "Speaks in emojis"})
    
    # The Consistent One
    if stats['longest_streak_days'] >= 21:
        roles.append({"role": "consistent", "title": "The Consistent One 📅", "description": "Never misses a day"})
    
    # Quick Responder
    if stats['avg_response_time_minutes'] and stats['avg_response_time_minutes'] < 5:
        roles.append({"role": "quick_response", "title": "Lightning Responder ⚡", "description": "Fastest fingers in the group"})
    
    # The Popular One
    if stats['replies_received'] >= 100:
        roles.append({"role": "popular", "title": "The Popular One 🌟", "description": "Everyone wants to talk to you"})
    
    # If no specific role, assign a general one
    if not roles:
        if stats['total_messages'] >= 50:
            roles.append({"role": "contributor", "title": "Solid Contributor 💬", "description": "Keeps things moving"})
        else:
            roles.append({"role": "observer", "title": "Thoughtful Observer 👁️", "description": "Quality over quantity"})
    
    return roles

# --------------------------
# HELPER FUNCTIONS
# --------------------------
def is_question(message):
    msg_lower = message.lower()
    return any(marker in msg_lower for marker in QUESTION_MARKERS)

def count_links(message):
    return len(re.findall(r'https?://\S+', message))

def is_media(message):
    return '<Media omitted>' in message

def count_emojis(message):
    return sum(1 for c in message if c in emoji.EMOJI_DATA)

def get_hour(dt):
    return dt.hour

def is_weekend(dt):
    return dt.weekday() in [5, 6]

def is_night(hour):
    return hour >= 22 or hour <= 4

def is_early_bird(hour):
    return 5 <= hour <= 11

# --------------------------
# ANALYZE MESSAGES - OPTIMIZED
# --------------------------
def analyze_messages(messages):
    if not messages:
        return {}
    
    print(f"Analyzing {len(messages)} messages...")
    
    messages.sort(key=lambda x: x['datetime'])
    
    print("Pre-processing message data...")
    for i, msg in enumerate(messages):
        msg['hour'] = msg['datetime'].hour
        msg['date'] = msg['datetime'].date()
        msg['is_weekend'] = is_weekend(msg['datetime'])
        msg['is_night'] = is_night(msg['hour'])
        msg['is_early'] = is_early_bird(msg['hour'])
        msg['emoji_count'] = count_emojis(msg['message'])
        msg['link_count'] = count_links(msg['message'])
        msg['is_media'] = is_media(msg['message'])
        msg['is_question'] = is_question(msg['message'])
        msg['is_helping'] = is_helping(msg['message'])
        msg['topics'] = detect_topics(msg['message'])
        msg['index'] = i  # CRITICAL: Add index for fast lookup
        
        if i % 10000 == 0 and i > 0:
            print(f"Processed {i} messages...")
    
    print("Grouping messages by sender...")
    user_messages = defaultdict(list)
    for msg in messages:
        # Format phone numbers
        formatted_sender = format_nigerian_number(msg['sender'])
        msg['formatted_sender'] = formatted_sender
        user_messages[formatted_sender].append(msg)
    
    print("Calculating response times and replies...")
    response_times = defaultdict(list)
    reply_counts = defaultdict(int)
    
    for i in range(1, len(messages)):
        current = messages[i]
        previous = messages[i-1]
        
        time_gap = (current['datetime'] - previous['datetime']).total_seconds()
        
        if current['formatted_sender'] != previous['formatted_sender'] and time_gap < 1800:
            time_diff_minutes = time_gap / 60
            response_times[current['formatted_sender']].append(time_diff_minutes)
            reply_counts[previous['formatted_sender']] += 1
    
    first_message = messages[0]
    last_message = messages[-1]
    
    year_info = {
        "first_message": {
            "sender": first_message['formatted_sender'],
            "datetime": first_message['datetime'].isoformat(),
            "message": first_message['message'][:100]
        },
        "last_message": {
            "sender": last_message['formatted_sender'],
            "datetime": last_message['datetime'].isoformat(),
            "message": last_message['message'][:100]
        }
    }
    
    user_totals = {sender: len(msgs) for sender, msgs in user_messages.items()}
    max_messages = max(user_totals.values()) if user_totals else 1
    
    print("Calculating individual stats...")
    individual = {}
    
    # OPTIMIZED: Pre-calculate conversation starters globally
    print("Calculating conversation starters (optimized)...")
    conversation_starter_count = defaultdict(int)
    conversation_starter_count[messages[0]['formatted_sender']] = 1  # First message is always a starter
    
    for i in range(1, len(messages)):
        time_gap = (messages[i]['datetime'] - messages[i-1]['datetime']).total_seconds()
        if time_gap > 1800:  # 30 minutes
            conversation_starter_count[messages[i]['formatted_sender']] += 1
    
    for idx, (sender, user_msgs) in enumerate(user_messages.items(), 1):
        if idx % 10 == 0:
            print(f"Processing user {idx}/{len(user_messages)}: {sender}")
        
        total_msgs = len(user_msgs)
        percentile = round((total_msgs / max_messages) * 100, 2)
        
        dates = [msg['date'] for msg in user_msgs]
        total_days_active = len(set(dates))
        longest_streak, current_streak = calculate_streaks(dates)
        avg_msgs_per_active_day = round(total_msgs / total_days_active, 2) if total_days_active > 0 else 0
        
        avg_response_time = None
        if response_times[sender]:
            avg_response_time = round(sum(response_times[sender]) / len(response_times[sender]), 2)
        
        weekend_msgs = sum(1 for msg in user_msgs if msg['is_weekend'])
        weekday_msgs = total_msgs - weekend_msgs
        weekend_percentage = round((weekend_msgs / total_msgs) * 100, 2) if total_msgs > 0 else 0
        
        early_bird_msgs = sum(1 for msg in user_msgs if msg['is_early'])
        night_owl_msgs = sum(1 for msg in user_msgs if msg['is_night'])
        daytime_msgs = total_msgs - early_bird_msgs - night_owl_msgs
        
        if early_bird_msgs > night_owl_msgs:
            time_preference = "early_bird"
        elif night_owl_msgs > early_bird_msgs:
            time_preference = "night_owl"
        else:
            time_preference = "daytime"
        
        all_emojis = [c for msg in user_msgs for c in msg['message'] if c in emoji.EMOJI_DATA]
        favorite_emoji = None
        if all_emojis:
            emoji_counter = Counter(all_emojis)
            favorite_emoji = emoji_counter.most_common(1)[0][0]
        
        replies_received = reply_counts.get(sender, 0)
        
        # OPTIMIZED: Use pre-calculated conversation starters
        conversation_starters = conversation_starter_count[sender]
        
        total_emojis = sum(msg['emoji_count'] for msg in user_msgs)
        total_links = sum(msg['link_count'] for msg in user_msgs)
        total_media = sum(1 for msg in user_msgs if msg['is_media'])
        question_messages = sum(1 for msg in user_msgs if msg['is_question'])
        helping_messages = sum(1 for msg in user_msgs if msg['is_helping'])
        
        # Topic analysis
        all_topics = []
        for msg in user_msgs:
            all_topics.extend(msg['topics'])
        
        topic_counter = Counter(all_topics)
        top_topics = dict(topic_counter.most_common(3))
        
        # Format topics for display
        topic_interests = []
        topic_names = {
            "jobs_career": "Jobs & Career 💼",
            "python_dev": "Python Development 🐍",
            "web_dev": "Web Development 🌐",
            "blockchain": "Blockchain & Web3 ₿",
            "data_science": "Data Science 📊",
            "mobile_dev": "Mobile Development 📱",
            "devops": "DevOps & Cloud ☁️",
            "business_startup": "Business & Startups 🚀",
            "learning": "Learning & Education 📚",
            "help_support": "Help & Support 🆘"
        }
        
        for topic, count in top_topics.items():
            if count >= 3:
                topic_interests.append({
                    "topic": topic,
                    "name": topic_names.get(topic, topic),
                    "count": count
                })
        
        # Determine activity level
        activity_level, activity_title = determine_activity_level(
            total_msgs, 
            total_days_active, 
            longest_streak, 
            avg_msgs_per_active_day,
            percentile
        )
        
        # Create stats dict for role determination
        stats_for_roles = {
            'total_messages': total_msgs,
            'helping_messages': helping_messages,
            'question_messages': question_messages,
            'conversation_starters': conversation_starters,
            'total_links': total_links,
            'total_media': total_media,
            'night_owl_messages': night_owl_msgs,
            'early_bird_messages': early_bird_msgs,
            'weekend_messages': weekend_msgs,
            'total_emojis': total_emojis,
            'longest_streak_days': longest_streak,
            'avg_response_time_minutes': avg_response_time,
            'replies_received': replies_received
        }
        
        # Determine user roles
        user_roles = determine_user_role(stats_for_roles)
        
        # Fun badges
        fun = []
        if total_emojis > 50:
            fun.append("emoji_king")
        if total_links > 5:
            fun.append("link_sharer")
        if total_media > 5:
            fun.append("media_master")
        if night_owl_msgs > 10:
            fun.append("night_owl")
        if weekend_msgs > 20:
            fun.append("weekend_warrior")
        if longest_streak >= 7:
            fun.append("streak_master")
        if avg_response_time and avg_response_time < 5:
            fun.append("quick_responder")
        
        individual[sender] = {
            "total_messages": total_msgs,
            "percentile": percentile,
            "total_days_active": total_days_active,
            "avg_messages_per_active_day": avg_msgs_per_active_day,
            "longest_streak_days": longest_streak,
            "current_streak_days": current_streak,
            "avg_response_time_minutes": avg_response_time,
            "weekend_messages": weekend_msgs,
            "weekday_messages": weekday_msgs,
            "weekend_percentage": weekend_percentage,
            "early_bird_messages": early_bird_msgs,
            "night_owl_messages": night_owl_msgs,
            "daytime_messages": daytime_msgs,
            "time_preference": time_preference,
            "was_first_message": sender == year_info["first_message"]["sender"],
            "was_last_message": sender == year_info["last_message"]["sender"],
            "replies_received": replies_received,
            "conversation_starters": conversation_starters,
            "question_messages": question_messages,
            "helping_messages": helping_messages,
            "favorite_emoji": favorite_emoji,
            "topic_interests": topic_interests,
            "activity_level": activity_level,
            "activity_title": activity_title,
            "user_roles": user_roles,
            "fun_badges": fun
        }
    # Calculate community stats
    user_totals = {sender: len(msgs) for sender, msgs in user_messages.items()}
    avg_msgs_per_user = sum(user_totals.values()) / len(user_totals) if user_totals else 0
    
    # Find busiest day
    all_dates = [msg['date'] for msg in messages]
    date_counts = Counter(all_dates)
    busiest_day = date_counts.most_common(1)[0][0].strftime('%B %d, %Y') if date_counts else None
    
    # Top members
    top_members = [
        {"name": sender, "messages": count} 
        for sender, count in sorted(user_totals.items(), key=lambda x: x[1], reverse=True)[:10]
    ]
    
    # Add community stats to year_info
    year_info["community"] = {
        "total_messages": len(messages),
        "active_members": len(user_messages),
        "avg_messages_per_user": round(avg_msgs_per_user, 1),
        "busiest_day": busiest_day,
        "top_members": top_members
    }
    
    print("Analysis complete!")
    return {
        "year_info": year_info,
        "individual": individual
    }
    print("Analysis complete!")

# --------------------------
# EXPORT JSON
# --------------------------
def export_json(data, filename='wrap2.json'):
    print(f"Exporting to {filename}...")
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✅ Wrap exported to {filename}")

# --------------------------
# MAIN
# --------------------------
if __name__ == "__main__":
    print("Starting WhatsApp Wrap analysis...")
    messages = []
    
    print("Reading file...")
    with open("whatsapp2.txt", 'r', encoding='utf-8') as f:
        for i, line in enumerate(f, 1):
            if i % 10000 == 0:
                print(f"Read {i} lines...")
            parsed = parse_line(line)
            if parsed:
                messages.append(parsed)
    
    print(f"\n✅ Successfully parsed {len(messages)} messages")
    
    if messages:
        data = analyze_messages(messages)
        export_json(data)
        print(f"\n🎉 Done! Found {len(data['individual'])} users")
    else:
        print("❌ No messages found. Check your file format.")