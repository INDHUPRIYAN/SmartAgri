import { ROUTES } from './routes';

let customStack = [ROUTES.HOME];

export const pushToStack = (route) => {
  customStack.push(route);
};

export const popFromStack = () => {
  if (customStack.length > 1) {
    customStack.pop();
    return customStack[customStack.length - 1];
  }
  return null;
};

export const getCurrentStack = () => [...customStack];
