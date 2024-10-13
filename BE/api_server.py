# Author : Clyde0909
# Date: 2024-10-13
# Version: 0.1

# import fastapi
from fastapi import FastAPI, HTTPException, Request, Response

# import other libraries
import os, json

# make app
app = FastAPI()

# root path
@app.get("/")
async def root():
    return {"message": "Hello World"}
  
if __name__ == "__main__":
  import uvicorn
  uvicorn.run(app, host="localhost", port=12399)
  