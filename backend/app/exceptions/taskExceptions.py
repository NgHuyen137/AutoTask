from .baseExceptions import BaseError

class TaskNotFoundError(BaseError):
    '''An error for not finding a task'''
    pass

class TaskAutoScheduleError(BaseError):
    '''An error for unable to automatically schedule a task'''
    pass