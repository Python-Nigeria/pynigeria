import re
import json
from collections import defaultdict
from datetime import datetime
import os
import emoji

def analyze_whatsapp_messages(file_path):
    """
    Analyze message counts from a WhatsApp export text file with a specific format.
    """
    # Initialize data structures
    messages_by_sender = defaultdict(int)
    messages_by_date = defaultdict(int)
    message_times = defaultdict(lambda: defaultdict(int))
    total_messages = 0
    media_messages = defaultdict(int)
    
    # Updated regex pattern to handle more variations
    # pattern = re.compile(r'^(\d{1,2}/\d{1,2}/\d{2}), (\d{1,2}:\d{2} [AP]M) - ([^:]+):? (.*)$')
    pattern = re.compile(r'^(\d{1,2}/\d{1,2}/\d{2}), (\d{1,2}:\d{2}(?:\u202f[AP]M| [AP]M)) - ([^:]+):?(.*)$')

    # Patterns to skip
    skip_patterns = [
        'end-to-end encrypted',
        'created group',
        'joined',
        'changed to',
        'joined using this group\'s invite link'
    ]
    
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            for line_number, line in enumerate(file, 1):
                line = line.strip()
                
                # Skip empty lines and system messages
                if not line or any(skip in line for skip in skip_patterns):
                    continue
                
                match = pattern.match(line)
                if match:
                    # Parse message details
                    date_str, time_str, sender, message = match.groups()
                    
                    # Parse date
                    try:
                        message_date = datetime.strptime(date_str, '%m/%d/%y')
                    except ValueError:
                        try:
                            message_date = datetime.strptime(date_str, '%d/%m/%y')
                        except ValueError:
                            print(f"Failed to parse date: {date_str}")
                            continue
                    
                    # Parse time
                    try:
                        message_time = datetime.strptime(time_str, '%I:%M %p')
                    except ValueError:
                        print(f"Failed to parse time: {time_str}")
                        continue
                    
                    # Clean up sender name
                    sender = sender.strip()
                    
                    # Skip if message is empty
                    if not message.strip():
                        continue
                    
                    # Count messages
                    messages_by_sender[sender] += 1
                    messages_by_date[str(message_date.date())] += 1
                    message_times[sender][message_time.hour] += 1
                    
                    # Track media messages
                    if '<Media omitted>' in message:
                        media_messages[sender] += 1
                    
                    total_messages += 1
    
    except FileNotFoundError:
        print(f"Error: File not found at {file_path}")
        return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None
    
    # Prepare results with JSON-friendly formatting
    results = {
        # 'total_messages': total_messages,
        # 'messages_by_sender': [{'name':k,'messages':v} for k,v in sorted(messages_by_sender.items(), key=lambda x:x[1], reverse=True)],
        # 'messages_by_date': dict(messages_by_date),
        # 'most_active_date': sorted(messages_by_date, key=max, reverse=True),
        # 'message_times_by_sender': {sender: dict(times) for sender, times in message_times.items()},
        # 'media_messages_by_sender': dict(media_messages)
    }
    
    return results

def export_to_json(results, output_path='messageDates.json'):
    """
    Export analysis results to a JSON file.
    """
    if results:
        # Write to JSON file with indentation for readability
        with open(output_path, 'w', encoding='utf-8') as file:
            json.dump(results, file, indent=4, ensure_ascii=False)
        print(f"Analysis results exported to {output_path}")
    else:
        print("No results to export.")

def main():
    # Prompt for input file path
    # file_path = input("Enter the path to your WhatsApp chat export text file: ").strip()
    
    # Analyze messages
    results = analyze_whatsapp_messages("whatsapp.txt")
    
    # Export to JSON
    if results:
        export_to_json(results)
    else:
        print("Analysis failed. Please check the file path and format.")



import re
from collections import defaultdict
from datetime import datetime
import emoji

# Function to get total number of messages for each user
def get_total_messages(messages, user):
    return sum(1 for msg in messages if msg['sender'] == user)

# Function to get total words in messages for each user
def get_total_words(messages, user):
    total_words = 0
    for message in messages:
        if message['sender'] == user:
            total_words += len(message['message'].split())
    return total_words

# Function to get total media files (e.g., media omitted messages) for each user
def get_total_files(messages, user):
    total_files = 0
    for message in messages:
        if message['sender'] == user and '<Media omitted>' in message['message']:
            total_files += 1
    return total_files

# Function to get total emojis used in messages for each user
# def get_total_emoji(messages, user):
#     emoji_pattern = re.compile("[\U0001F600-\U0001F64F"
#                                "\U0001F300-\U0001F5FF"
#                                "\U0001F680-\U0001F6FF"
#                                "\U0001F700-\U0001F77F"
#                                "\U0001F780-\U0001F7FF"
#                                "\U0001F800-\U0001F8FF"
#                                "\U0001F900-\U0001F9FF"
#                                "\U0001FA00-\U0001FA6F"
#                                "\U0001FA70-\U0001FAFF"
#                                "\U0002600-\U00026FF"
#                                "\U0002700-\U00027BF"
#                                "\U0002300-\U00023FF"
#                                "\U0002B50]"
#                                , flags=re.UNICODE)
#     for message in messages:
#         if message['sender'] == user:
#             total_emojis += len([char for char in message['message'] if char in emoji.EMOJI_UNICODE])
#     return total_emojis

#     return len(emoji_pattern.findall(messages))

# Example usage
# total_emojis = 0
# for message in messages:
#     total_emojis += count_emojis(message['message'])

# print(f"Total Emojis: {total_emojis}")

#     return total_emojis

# Function to get total links shared in messages for each user
def get_total_links(messages, user):
    total_links = 0
    link_pattern = r'https?://\S+'
    for message in messages:
        if message['sender'] == user:
            total_links += len(re.findall(link_pattern, message['message']))
    return total_links

# Function to get messages per user
def get_messages_per_user(messages):
    messages_per_user = defaultdict(int)
    for message in messages:
        messages_per_user[message['sender']] += 1
    return dict(messages_per_user)

# Function to get messages per week for each user
def get_messages_per_week(messages, user):
    messages_per_week = defaultdict(int)
    for message in messages:
        if message['sender'] == user:
            week_num = message['date'].strftime('%Y-%U')  # Get year and week number
            messages_per_week[week_num] += 1
    return dict(messages_per_week)

# Function to get messages per month for each user
def get_messages_per_month(messages, user):
    messages_per_month = defaultdict(int)
    for message in messages:
        if message['sender'] == user:
            month = message['date'].strftime('%Y-%m')  # Get year and month
            messages_per_month[month] += 1
    return dict(messages_per_month)

# Function to get days with more messages for each user
def get_days_with_more_messages(messages, user):
    messages_per_day = defaultdict(int)
    for message in messages:
        if message['sender'] == user:
            day = message['date'].strftime('%Y-%m-%d')  # Get the specific day
            messages_per_day[day] += 1
    # Find the days with the highest number of messages
    max_messages = max(messages_per_day.values(), default=0)
    return {day: count for day, count in messages_per_day.items() if count == max_messages}

# Main function to gather all stats for each user
def get_user_stats(messages):
    # user_stats = defaultdict(dict)
    stats =  []
    # Get all unique users
    if messages:
        users = set(message['sender'] for message in messages)

        # Calculate stats for each user
        # for user in users:
        #     stripuser = user.replace(" ","")
        #     user_stats[stripuser] = {
        #         'total_messages': get_total_messages(messages, user),
        #         'total_words': get_total_words(messages, user),
        #         'total_files': get_total_files(messages, user),
        #         # 'total_emojis': get_total_emoji(messages, user),
        #         'total_links': get_total_links(messages, user),
        #         'messages_per_user': get_messages_per_user(messages).get(user, 0),
        #         'messages_per_week': get_messages_per_week(messages, user),
        #         'messages_per_month': get_messages_per_month(messages, user),
        #         'days_with_more_messages': get_days_with_more_messages(messages, user),
        #     }

        for user in users:
            stripuser = user.replace(" ","")
            stats.append(stripuser)
        # return dict(user_stats)
        return stats
    return


def parse_line_to_dict(line):
    """
    Parse a line from the WhatsApp export file into a dictionary with keys:
    'sender', 'message', and 'date'.
    """
    # Regex pattern to match the WhatsApp format (date, time, sender, message)
    pattern = re.compile(r'^(\d{1,2}/\d{1,2}/\d{2}), (\d{1,2}:\d{2}(?:\u202f[AP]M| [AP]M)) - ([^:]+):?(.*)$')
    skip_patterns = [
        'end-to-end encrypted',
        'created group',
        'joined',
        'changed to',
        'joined using this group\'s invite link',
        'left',
        'added',
        'changed',
        'removed',
        'requested',
        'Membersinthisgrouparenowcommunitymembers',
        'Anyoneinthecommunity',
        'Newmembersneedadminapprovaltojointhisgroup.Taptochange.'
    ]
    
    if not line or any(skip in line for skip in skip_patterns):
        return None
    
    match = pattern.match(line)
    if match:
        date_str, time_str, sender, message = match.groups()
        
        # Parse date and time
        try:
            message_date = datetime.strptime(date_str, '%m/%d/%y')
        except ValueError:
            message_date = datetime.strptime(date_str, '%d/%m/%y')  # Try the other format
        
        # Store parsed data into a dictionary

        special = {'tensor': "+2349079755026",'the_gopher':"+2348118997115",'JB':"+234810842119",'ita mio':"+2347072944647",'Tech_princess':"+2349039842407","Lorenzo":"+2348134514639","Olotu Praise Jah":"+2347083023292","Rtr. Chukwuebuka":"+2348073194769","Dess":"+2347042507852","Ada-Ihueze":"+1(502)263-3522","CryptoKellz":"+2349027208946","Aaliyah":"+2349054253327","Vee":"+2348060755418","debugtitan":"+2349066526940","Horlar":"+2349034767600","Kemzzy":"+2349038306057","Temi":"+2348117612515","Ojogu":"+2349065011334","Danny":"+2347036630405","Tobias":"+2349037546885","Orden":"+2347046655760","Blue_Gate2.0":"+2347055673702","Nonso":"+2348134754827"}
        message_data = {
            'sender': special[sender.strip()] if sender.strip() in  special.keys() else sender.strip(),
            'message': message.strip(),
            'date': message_date,
        }
        return message_data
    else:
        return None  # Return None if the line doesn't match the expected format


# Step 1: Read messages from text file
# messages = []
# with open("whatsaapp2.txt", 'r', encoding='utf-8') as file:
#     for line in file:
#         # Parse each line into a message dictionary (modify according to your data structure)
#         message = parse_line_to_dict(line)
#         if message:  # Only append valid parsed messages
#             messages.append(message)
#         # messages.append(message)


# # Step 2: Analyze the WhatsApp data
# analysis_result = get_user_stats(messages)
# previous = []
# with open('members.json','r') as f:
#     previous = json.load(f)
# # Step 3: Write the analysis result to a JSON file
# with open('members.json', 'w') as f:
#     json.dump([*previous,*analysis_result], f, indent=4)  # Use `json.dump` for writing

