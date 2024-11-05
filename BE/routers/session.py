# router for session

from fastapi import APIRouter, Request
import sqlite3, subprocess, datetime, hashlib

router = APIRouter(
  prefix="/session",
  tags=["session"]
)

@router.get("/is_init")
async def isInit():
  # get db connection and check row in session_info table. ./server_files/database.db
  conn = sqlite3.connect("/home/ubuntu/workspace/WebYtDlp/BE/server_files/database.db")
  c = conn.cursor()
  c.execute("SELECT * FROM session_info")
  if c.fetchone() is None:
    return {"isInit": False}
  else:
    return {"isInit": True}

# session register api.
@router.post("/register_session")
async def register_session(request: Request):

  # hash password
  request_data = await request.json()
  password = request_data["password"]
  password = hashlib.sha256(password.encode()).hexdigest()
  # get current yt-dlp version
  yt_dlp_version = subprocess.check_output(["yt-dlp", "--version"]).decode("utf-8").split("\n")[0]
  # get current storage info of total system(kbyte)
  storage_info = subprocess.check_output(["df", "/"]).decode("utf-8").split("\n")[1].split()
  total_storage = int(storage_info[1]) # kbyte
  used_storage = int(storage_info[2]) # kbyte
  # get user ip
  user_ip = request.client.host
  # make token with user ip and current time
  token = hashlib.sha256((user_ip + str(datetime.datetime.now())).encode()).hexdigest()
  
  # get db connection and insert password into session_info table. ./server_files/database.db
  conn = sqlite3.connect("/home/ubuntu/workspace/WebYtDlp/BE/server_files/database.db")
  c = conn.cursor()
  c.execute("INSERT INTO session_info (password, current_ytdlp_version, total_storage, used_storage, latest_session_time, latest_session_ip, token, token_expire_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (password, yt_dlp_version, total_storage, used_storage, str(datetime.datetime.now()), user_ip, token, str(datetime.datetime.now() + datetime.timedelta(hours=1))))
  conn.commit()
  conn.close()
  
  return {"result": "success", "token": token}


# token check api.
@router.post("/check_token")
async def check_token(request: Request):
  request_data = await request.json()
  token = request_data["token"]

  # get db connection and check token in session_info table. ./server_files/database.db
  conn = sqlite3.connect("/home/ubuntu/workspace/WebYtDlp/BE/server_files/database.db")
  c = conn.cursor()
  c.execute("SELECT * FROM session_info WHERE token=?", (token,))
  result = c.fetchone()

  # if token is not exist, return fail
  if result is None:
    conn.close()
    return {"result": "fail", "message": "token is not exist"}
  
  # if token is exist and expired, return fail
  if datetime.datetime.now() >= datetime.datetime.strptime(result[7], "%Y-%m-%d %H:%M:%S.%f"):
    conn.close()
    return {"result": "fail", "message": "token is expired"}
  
  # if token is exist and not expired, update expire time and return success
  if datetime.datetime.now() < datetime.datetime.strptime(result[7], "%Y-%m-%d %H:%M:%S.%f"):
    c.execute("UPDATE session_info SET token_expire_time=? WHERE token=?", (str(datetime.datetime.now() + datetime.timedelta(hours=1)), token))
    conn.commit()
    conn.close()
    return {"result": "success"}
  
# login api.
@router.post("/login")
async def login(request: Request):
  request_data = await request.json()
  password = request_data["password"]
  password = hashlib.sha256(password.encode()).hexdigest()
  
  # get db connection and check password in session_info table. ./server_files/database.db
  conn = sqlite3.connect("/home/ubuntu/workspace/WebYtDlp/BE/server_files/database.db")
  c = conn.cursor()
  c.execute("SELECT * FROM session_info")
  result = c.fetchone()
  
  # if password is not exist, return fail
  if result[0] == "":
    conn.close()
    return {"result": "fail"}
  
  # if password is exist, check password. if password is correct update latest session time and ip, return token
  if result[0] == password:
    user_ip = request.client.host
    token = hashlib.sha256((user_ip + str(datetime.datetime.now())).encode()).hexdigest()
    c.execute("UPDATE session_info SET latest_session_time=?, latest_session_ip=?, token=?, token_expire_time=? WHERE password=?", (str(datetime.datetime.now()), user_ip, token, str(datetime.datetime.now() + datetime.timedelta(hours=1)), password))
    conn.commit()
    conn.close()
    return {"result": "success", "token": token}
  elif result[0] != password:
    conn.close()
    return {"result": "fail"}