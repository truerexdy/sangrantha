import json
import shutil
import os
from datetime import datetime

def add_blog():
    md_file_path = input("Enter the path to the markdown file: ").strip()
    
    if not os.path.exists(md_file_path):
        print("File does not exist!")
        return
    
    if not md_file_path.endswith('.md'):
        print("File is not a markdown file!")
        return
    
    title = input("Enter the blog title: ").strip()
    
    if not title:
        print("Title cannot be empty!")
        return
    
    try:
        with open('blogList.json', 'r') as f:
            blogs = json.load(f)
    except FileNotFoundError:
        blogs = []
    except json.JSONDecodeError:
        print("Error reading blogList.json")
        return
    
    if blogs:
        new_id = max(blog['id'] for blog in blogs) + 1
    else:
        new_id = 0
    
    current_time = datetime.now().isoformat()
    
    new_blog = {
        "id": new_id,
        "title": title,
        "postedTime": current_time,
        "lastUpdatedTime": current_time
    }
    
    blogs.insert(0, new_blog)
    
    os.makedirs('blogs', exist_ok=True)
    
    destination_path = f'blogs/{new_id}.md'
    shutil.copy2(md_file_path, destination_path)
    
    with open('blogList.json', 'w') as f:
        json.dump(blogs, f, indent=4)
    
    print(f"Blog added successfully!")
    print(f"ID: {new_id}")
    print(f"Title: {title}")
    print(f"File copied to: {destination_path}")

if __name__ == "__main__":
    add_blog()