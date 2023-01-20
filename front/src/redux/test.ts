import React from 'react';
import { configureStore } from '@reduxjs/toolkit'

const initialState = { value: 0 }

export function counterReducer(state = initialState, action: any) {
  // Check to see if the reducer cares about this action
  if (action.type === 'counter/increment') {
    // If so, make a copy of `state`
    return {
      ...state,
      // and update the copy with the new value
      value: state.value + 1
    }
  }
  // otherwise return the existing state unchanged
  return state
}


