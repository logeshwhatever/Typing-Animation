import "./style.css";
import Typewriter from "./Typewriter";

const typeWriter = new Typewriter(
  document.querySelector(".whitespace") as HTMLDivElement,
  { loop: false }
);

typeWriter
  .deleteAll(10)
  .typeString("Hello, World!")
  .pauseFor(1000)
  .deleteChars(7)
  .typeString("This is a test.")
  .deleteAll(10)
  .start();
