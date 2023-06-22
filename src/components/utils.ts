import type { JSX } from "solid-js/jsx-runtime";

export function pluralize(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

export const animateRipple: JSX.EventHandler<HTMLElement, MouseEvent> = (e) => {
  const buttonElement = e.currentTarget;
  const buttonRect = buttonElement.getBoundingClientRect();

  const diameter = Math.max(
    buttonElement.clientWidth,
    buttonElement.clientHeight,
  );
  const radius = diameter / 2;

  const circle = document.createElement("span");
  circle.style.width = `${diameter}px`;
  circle.style.height = `${diameter}px`;
  circle.style.left = `${e.clientX - buttonRect.left - radius}px`;
  circle.style.top = `${e.clientY - buttonRect.top - radius}px`;
  circle.classList.add("ripple");

  const [ripple] = buttonElement.getElementsByClassName("ripple");
  if (ripple) ripple.remove();

  buttonElement.appendChild(circle);
};
