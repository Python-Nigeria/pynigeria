import re
import json
from collections import defaultdict, Counter
from datetime import datetime, timedelta
import emoji
import pandas as pd

# --------------------------
# CONFIG & TOPIC BUCKETS
# --------------------------
TOPIC_KEYWORDS = {
    "jobs": ["job", "hiring", "vacancy", "opportunity"],
    "python": ["python", "django", "flask", "fastapi"],
    "blockchain": ["solana", "web3", "nft", "crypto"],
    # Add more topics relevant to your community
}

QUESTION_MARKERS = ["?", "what", "how", "why", "when", "who"]

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
        date = datetime.strptime(date_str, '%d/%m/%y')
    try:
        time = datetime.strptime(time_str, '%I:%M %p')
    except ValueError:
        return None
    
    return {
        "sender": sender.strip(),
        "message": message.strip(),
        "datetime": datetime.combine(date.date(), time.time())
    }

# --------------------------
# CALCULATE STREAKS
# --------------------------
def calculate_streaks(dates):
    """Calculate longest and current streak from list of dates"""
    if not dates:
        return 0, 0
    
    sorted_dates = sorted(set(dates))
    longest_streak = 1
    current_streak = 1
    temp_streak = 1
    
    for i in range(1, len(sorted_dates)):
        if (sorted_dates[i] - sorted_dates[i-1]).days == 1:
            temp_streak += 1
        else:
            longest_streak = max(longest_streak, temp_streak)
            temp_streak = 1
    
    longest_streak = max(longest_streak, temp_streak)
    
    # Calculate current streak (from most recent date)
    last_date = sorted_dates[-1]
    current_streak = 1
    for i in range(len(sorted_dates) - 2, -1, -1):
        if (last_date - sorted_dates[i]).days == current_streak:
            current_streak += 1
        else:
            break
    
    return longest_streak, current_streak

# --------------------------
# CALCULATE RESPONSE TIME
# --------------------------
def calculate_response_times(df):
    """Calculate average response time per user"""
    response_times = defaultdict(list)
    
    df_sorted = df.sort_values('datetime')
    
    for i in range(1, len(df_sorted)):
        current = df_sorted.iloc[i]
        previous = df_sorted.iloc[i-1]
        
        # If different sender and within 30 minutes, consider it a response
        if (current['sender'] != previous['sender'] and 
            (current['datetime'] - previous['datetime']).total_seconds() < 1800):
            
            time_diff = (current['datetime'] - previous['datetime']).total_seconds() / 60
            response_times[current['sender']].append(time_diff)
    
    avg_response_times = {}
    for sender, times in response_times.items():
        if times:
            avg_response_times[sender] = round(sum(times) / len(times), 2)
    
    return avg_response_times

# --------------------------
# MOST REPLIED TO PERSON
# --------------------------
def calculate_most_replied_to(df):
    """Calculate who gets replied to the most"""
    reply_count = defaultdict(int)
    
    df_sorted = df.sort_values('datetime')
    
    for i in range(1, len(df_sorted)):
        current = df_sorted.iloc[i]
        previous = df_sorted.iloc[i-1]
        
        # If different sender and within 30 minutes, consider it a reply
        if (current['sender'] != previous['sender'] and 
            (current['datetime'] - previous['datetime']).total_seconds() < 1800):
            reply_count[previous['sender']] += 1
    
    most_replied_to = {}
    for sender in df['sender'].unique():
        most_replied_to[sender] = reply_count.get(sender, 0)
    
    return most_replied_to

# --------------------------
# ANALYZE MESSAGES
# --------------------------
def analyze_messages(messages):
    df = pd.DataFrame(messages)
    if df.empty:
        return {}
    
    # Add helper columns
    df['date'] = df['datetime'].dt.date
    df['hour'] = df['datetime'].dt.hour
    df['day_of_week'] = df['datetime'].dt.dayofweek  # 0=Monday, 6=Sunday
    df['is_weekend'] = df['day_of_week'].isin([5, 6])
    df['is_question'] = df['message'].str.lower().str.contains('|'.join(QUESTION_MARKERS))
    df['links'] = df['message'].str.count(r'https?://\S+')
    df['media'] = df['message'].str.contains('<Media omitted>')
    df['emoji_count'] = df['message'].apply(lambda x: len([c for c in x if c in emoji.EMOJI_DATA]))
    df['night_messages'] = df['hour'].between(22, 23) | df['hour'].between(0, 4)
    
    # Calculate response times
    avg_response_times = calculate_response_times(df)
    
    # Calculate most replied to
    most_replied_to = calculate_most_replied_to(df)
    
    # First and last message of the year
    first_message = df.loc[df['datetime'].idxmin()]
    last_message = df.loc[df['datetime'].idxmax()]
    
    year_info = {
        "first_message": {
            "sender": first_message['sender'],
            "datetime": first_message['datetime'].isoformat(),
            "message": first_message['message'][:100]  # First 100 chars
        },
        "last_message": {
            "sender": last_message['sender'],
            "datetime": last_message['datetime'].isoformat(),
            "message": last_message['message'][:100]
        }
    }
    
    # --------------------------
    # INDIVIDUAL STATS
    # --------------------------
    individual = {}
    user_counts = df['sender'].value_counts()
    
    for user, group in df.groupby('sender'):
        total_msgs = len(group)
        percentile = round((user_counts[user]/user_counts.max())*100, 2)
        
        # Streak stats
        user_dates = group['date'].tolist()
        longest_streak, current_streak = calculate_streaks(user_dates)
        
        # Response time
        avg_response_time = avg_response_times.get(user, None)
        
        # Weekend vs Weekday
        weekend_msgs = group['is_weekend'].sum()
        weekday_msgs = total_msgs - weekend_msgs
        weekend_ratio = round((weekend_msgs / total_msgs) * 100, 2) if total_msgs > 0 else 0
        
        # Early bird vs Night owl
        early_bird_msgs = group[group['hour'].between(5, 11)].shape[0]  # 5 AM - 11 AM
        night_owl_msgs = group[group['hour'].between(22, 23) | group['hour'].between(0, 4)].shape[0]  # 10 PM - 4 AM
        daytime_msgs = total_msgs - early_bird_msgs - night_owl_msgs
        
        time_preference = "early_bird" if early_bird_msgs > night_owl_msgs else "night_owl" if night_owl_msgs > early_bird_msgs else "daytime"
        
        # Favorite emoji
        user_emojis = [c for msg in group['message'] for c in msg if c in emoji.EMOJI_DATA]
        favorite_emoji = Counter(user_emojis).most_common(1)[0][0] if user_emojis else None
        
        # Most replied to count
        replies_received = most_replied_to.get(user, 0)
        
        # Conversation starters (messages after 30+ min gap)
        conversation_starters = 0
        group_sorted = group.sort_values('datetime')
        for i in range(len(group_sorted)):
            if i == 0:
                conversation_starters += 1
            else:
                time_gap = (group_sorted.iloc[i]['datetime'] - df[df['datetime'] < group_sorted.iloc[i]['datetime']]['datetime'].max()).total_seconds()
                if time_gap > 1800:  # 30 minutes
                    conversation_starters += 1
        
        # Fun badges
        fun = []
        if group['emoji_count'].sum() > 50:
            fun.append("emoji_king")
        if group['links'].sum() > 5:
            fun.append("link_sharer")
        if group['media'].sum() > 5:
            fun.append("media_master")
        if night_owl_msgs > 10:
            fun.append("night_owl")
        if weekend_msgs > 20:
            fun.append("weekend_warrior")
        if longest_streak >= 7:
            fun.append("streak_master")
        if avg_response_time and avg_response_time < 5:
            fun.append("quick_responder")
        
        individual[user] = {
            "total_messages": total_msgs,
            "percentile": percentile,
            
            # Streak stats
            "longest_streak_days": longest_streak,
            "current_streak_days": current_streak,
            
            # Response time
            "avg_response_time_minutes": avg_response_time,
            
            # Weekend vs Weekday
            "weekend_messages": int(weekend_msgs),
            "weekday_messages": int(weekday_msgs),
            "weekend_percentage": weekend_ratio,
            
            # Time of day preference
            "early_bird_messages": int(early_bird_msgs),
            "night_owl_messages": int(night_owl_msgs),
            "daytime_messages": int(daytime_msgs),
            "time_preference": time_preference,
            
            # First/Last message participation
            "was_first_message": user == year_info["first_message"]["sender"],
            "was_last_message": user == year_info["last_message"]["sender"],
            
            # Most replied to
            "replies_received": replies_received,
            
            # Other stats
            "conversation_starters": int(conversation_starters),
            "favorite_emoji": favorite_emoji,
            "fun_badges": fun
        }
    
    return {
        "year_info": year_info,
        "individual": individual
    }

# --------------------------
# EXPORT JSON
# --------------------------
def export_json(data, filename='wrap.json'):
    # Convert any datetime objects to strings
    def convert_datetime(obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return obj
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False, default=convert_datetime)
    print(f"Wrap exported to {filename}")

# --------------------------
# MAIN
# --------------------------
if __name__ == "__main__":
    messages = []
    with open("whatsapp.txt", 'r', encoding='utf-8') as f:
        for line in f:
            parsed = parse_line(line)
            if parsed:
                messages.append(parsed)
    
    print(f"Parsed {len(messages)} messages")
    data = analyze_messages(messages)
    export_json(data)