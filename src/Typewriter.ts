type QueueItem = () => Promise<void>; // A function that returns a promise

export default class Typewriter {
  #queue: QueueItem[] = []; // An array of functions that return promises
  #element: HTMLElement; // The element to type into
  #loop: boolean;
  #typingSpeed: number;
  #deletingSpeed: number;
  constructor(
    parent: HTMLElement,
    { loop = true, typingSpeed = 50, deletingSpeed = 50 } = {}
  ) {
    this.#element = document.createElement("div");
    parent.append(this.#element);
    this.#loop = loop;
    this.#typingSpeed = typingSpeed;
    this.#deletingSpeed = deletingSpeed;
  }
  typeString = (text: string) => {
    // Add a new item to the queue
    this.#addToQueue((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        this.#element.append(text[i]);
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, this.#typingSpeed);
    });
    return this;
  };
  deleteChars = (number: number) => {
    this.#addToQueue((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        this.#element.innerText = this.#element.innerText?.substring(
          0,
          this.#element.innerText.length - 1
        );
        i++;
        if (i >= number) {
          clearInterval(interval);
          resolve();
        }
      }, this.#deletingSpeed);
    });
    return this;
  };
  deleteAll(deleteSpeed = this.#deletingSpeed) {
    this.#addToQueue((resolve) => {
      const interval = setInterval(() => {
        this.#element.innerText = this.#element.innerText?.substring(
          0,
          this.#element.innerText.length - 1
        );
        if (this.#element.innerText.length === 0) {
          clearInterval(interval);
          resolve();
        }
      }, deleteSpeed);
    });
    return this;
  }
  pauseFor = (duration: number) => {
    this.#addToQueue((resolve) => {
      setTimeout(resolve, duration);
    });
    return this;
  };

  // This function loops through the queue and runs each function
  // in order. If the loop option is set to true, it will add each
  // function back to the end of the queue after it has been exexuted.
  async start() {
    let cb = this.#queue.shift(); // Get the first item in the queue
    // Loop through the queue
    while (cb != null) {
      await cb(); // Run the function
      if (this.#loop) this.#queue.push(cb); // Add the function back to the end of the queue
      cb = this.#queue.shift(); // Get the next item in the queue
    }
    return this;
  }

  #addToQueue(cb: (resolve: () => void) => void) {
    this.#queue.push(() => new Promise(cb));
  }
}
