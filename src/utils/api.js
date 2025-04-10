// import axios from "axios";

// const BASE_URL = "https://api.trello.com/1";

// // Create axios instance with default parameters
// const api = axios.create({
//   baseURL: BASE_URL,
//   params: {
//     key: import.meta.env.VITE_API_KEY,
//     token: import.meta.env.VITE_TOKEN,
//   },
// });

// export const trelloApi = {
//   //BoardLists endpoints
//   getBoardsDetails: () => api.get(`/members/me/boards`),
//   postBoard: (boardName) => api.post(`/boards/`, null, { params: { name: boardName } }),

//   // Board endpoints
//   getBoardDetails: (boardId) => api.get(`/boards/${boardId}`),

//   getBoardLists: (boardId) => api.get(`/boards/${boardId}/lists`),

//   // List endpoints
//   createList: (boardId, name) =>
//     api.post(`/boards/${boardId}/lists`, null, { params: { name } }),

//   closeList: (listId) =>
//     api.put(`/lists/${listId}/closed`, null, { params: { value: true } }),

//   getListCards: (listId) => api.get(`/lists/${listId}/cards`),

//   // Card endpoints
//   createCard: (listId, name) =>
//     api.post(`/cards`, null, { params: { idList: listId, name } }),

//   deleteCard: (cardId) => api.delete(`/cards/${cardId}`),

//   updateCard: (cardId, params) => api.put(`/cards/${cardId}`, null, { params }),

//   getCardChecklists: (cardId) => api.get(`/cards/${cardId}/checklists`),

//   // Checklist endpoints
//   createChecklist: (cardId, name) =>
//     api.post(`/cards/${cardId}/checklists`, null, { params: { name } }),

//   deleteChecklist: (checklistId) => api.delete(`/checklists/${checklistId}`),

//   createCheckItem: (checklistId, name) =>
//     api.post(`/checklists/${checklistId}/checkItems`, null, {
//       params: { name },
//     }),

//   deleteCheckItem: (checklistId, itemId) =>
//     api.delete(`/checklists/${checklistId}/checkItems/${itemId}`),

//   updateCheckItem: (cardId, itemId, state) =>
//     api.put(`/cards/${cardId}/checkItem/${itemId}`, null, {
//       params: { state },
//     }),
// };
import axios from 'axios';

const BASE_URL = 'https://api.trello.com/1';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    key: import.meta.env.VITE_API_KEY,
    token: import.meta.env.VITE_TOKEN
  }
});

export const trelloApi = {
  // Board operations
  getBoardsDetails: () => api.get('/members/me/boards'),
  postBoard: (boardName) =>
    api.post('/boards/', null, { params: { name: boardName } }),
  getBoardDetails: (boardId) => api.get(`/boards/${boardId}`),
  getBoardLists: (boardId) => api.get(`/boards/${boardId}/lists`),

  // List operations
  createList: (boardId, name) =>
    api.post(`/boards/${boardId}/lists`, null, { params: { name } }),
  closeList: (listId) =>
    api.put(`/lists/${listId}/closed`, null, { params: { value: true } }),
  getListCards: (listId) => api.get(`/lists/${listId}/cards`),

  // Card operations
  createCard: (listId, name) =>
    api.post('/cards', null, { params: { idList: listId, name } }),
  deleteCard: (cardId) => api.delete(`/cards/${cardId}`),
  updateCard: (cardId, params) =>
    api.put(`/cards/${cardId}`, null, { params }),
  getCardChecklists: (cardId) => api.get(`/cards/${cardId}/checklists`),

  // Checklist operations
  createChecklist: (cardId, name) =>
    api.post(`/cards/${cardId}/checklists`, null, { params: { name } }),
  deleteChecklist: (checklistId) =>
    api.delete(`/checklists/${checklistId}`),
  createCheckItem: (checklistId, name) =>
    api.post(`/checklists/${checklistId}/checkItems`, null, {
      params: { name }
    }),
  deleteCheckItem: (checklistId, itemId) =>
    api.delete(`/checklists/${checklistId}/checkItems/${itemId}`),
  updateCheckItem: (cardId, itemId, state) =>
    api.put(`/cards/${cardId}/checkItem/${itemId}`, null, {
      params: { state }
    })
};
