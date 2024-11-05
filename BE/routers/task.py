# router for task

from fastapi import APIRouter

router = APIRouter(
  prefix="/task",
  tags=["task"]
)

@router.get("/getTaskList")
async def getTaskList():
  return {"taskList": []}