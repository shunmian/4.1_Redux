import { combineReducers } from 'redux'

const handleTogoleTodo = (state, action,filter) => {
  const { result: toggledId, entities } = action.response;
  const { completed } = entities.todos[toggledId];
  const shouldRemove = (
    (completed && filter === 'active') ||
    (!completed && filter === 'completed')
  );
  return shouldRemove ?
    state.filter(id => id !== toggledId) :
    state;
};


const createList = (filter) => {
  const ids = (state = [], action) => {
    switch (action.type) {
      case 'FETCH_TODOS_SUCCESS':
        return filter === action.filter ? action.response.result : state;
      case 'ADD_TODO_SUCCESS':
        return filter !== 'completed' ? [
          ...state,
          action.response.result
         ] : state;
      case 'TOGGLE_TODO_SUCCESS':
         return handleTogoleTodo(state, action,filter);
      default:
        return state;
    }
  };

  const isFetching = (state=false,action)=>{
    if (action.filter !== filter) {
      return state;
    }
    switch(action.type) {
      case 'FETCH_TODOS_SUCCESS':
      case 'FETCH_TODOS_ERROR':
        return false;
      case 'FETCH_TODOS_START':
        return true;
      default:
        return state
    }
  }

  const errorMessage = (state=null, action) => {
    if (action.filter !== filter) {
      return state;
    }
    switch(action.type){
      case 'FETCH_TODOS_ERROR':
        return action.errorMessage
      case 'FETCH_TODOS_SUCCESS':
        return null
      default:
        return state
    }
  }

  return combineReducers({
    ids,
    isFetching,
    errorMessage,
  })
}


const getIds = (state) => state.ids;
const getIsFetching = (state) =>state.isFetching;
const getErrorMessage = (state) => state.errorMessage;


export default createList
export { getIds, getIsFetching, getErrorMessage }