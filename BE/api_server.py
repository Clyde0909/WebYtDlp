# Author : Clyde0909
# First Created: 2024-10-13
# Last Modified: 2024-10-20
# Version: 0.1.2

# import fastapi
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware

# import lib for sqlite database
import sqlite3

# import other libraries
import os, datetime

# make app
app = FastAPI()

# allow cors from all origins
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

# import routers
from routers import session, task, misc
app.include_router(session.router)
app.include_router(task.router)
app.include_router(misc.router)

# make db connection, if not exist, create new one
if not os.path.exists("/home/ubuntu/workspace/WebYtDlp/BE/server_files"):
  # make directory
  os.mkdir("/home/ubuntu/workspace/WebYtDlp/BE/server_files")
if not os.path.exists("/home/ubuntu/workspace/WebYtDlp/BE/server_files/database.db"):
  # make database file
  os.mknod("/home/ubuntu/workspace/WebYtDlp/BE/server_files/database.db")
      
# create tables
conn = sqlite3.connect("/home/ubuntu/workspace/WebYtDlp/BE/server_files/database.db")
c = conn.cursor()
# create 3 tables, session_info, task_list, task_info with BaseModel
# session_info: password(sha256), current_ytdlp_version(str), total_storage(int, kbyte), used_storage(int, kbyte), latest_session_time(datetime), latest_session_ip(str), token(str), token_expire_time(datetime)
# task_list: id(int, primary key, auto_increment), task_url(str), start_time(datetime), end_time(datetime), delYn(bool)
# task_info: id(int, foreign key), title(str), thumbnail(str), description(str), description(str), duration(int, sec), quality(str), file_size(int, kbyte)
c.execute("CREATE TABLE IF NOT EXISTS session_info (password TEXT, current_ytdlp_version TEXT, total_storage INTEGER, used_storage INTEGER, latest_session_time TEXT, latest_session_ip TEXT, token TEXT, token_expire_time TEXT)")
c.execute("CREATE TABLE IF NOT EXISTS task_list (id INTEGER PRIMARY KEY AUTOINCREMENT, task_url TEXT, start_time TEXT, end_time TEXT, delYn INTEGER)")
c.execute("CREATE TABLE IF NOT EXISTS task_info (id INTEGER, title TEXT, thumbnail TEXT, description TEXT, duration INTEGER, quality TEXT, file_size INTEGER)")
conn.commit()
conn.close()

if __name__ == "__main__":
  import uvicorn
  uvicorn.run(app, host="localhost", port=12399)
  