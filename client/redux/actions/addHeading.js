import { ADD_HEADING } from './types';

export function addHeading(heading) {
  return {
    type: ADD_HEADING,
    payload: heading
  };
}
