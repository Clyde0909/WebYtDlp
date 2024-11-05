# router for misc

from fastapi import APIRouter
import subprocess

# path variable
path = "/home/ubuntu/workspace/WebYtDlp/BE/server_files/"

router = APIRouter(
  prefix="/misc",
  tags=["misc"]
)

@router.get("/ytdlpVersion")
async def ytdlpVersion():
  # get ytdlp version
  result = subprocess.run([path + "yt-dlp_linux_aarch64", "--version"], stdout=subprocess.PIPE)
  return result.stdout.decode("utf-8")