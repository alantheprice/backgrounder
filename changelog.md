* **1.1.2**
  * Default to current functional scope when invoking functions.
* **1.1.1**
  * Removed Reference from top of d.ts file.
* **1.1.0**
  * Added document, window and console functions as callable functions within a worker.
  * Updated the way the function Definition object to allow calling restricted objects (window, document, console);
* **1.0.0**
  * Cleaned up the api to make it more simple and consistent.
  * Added fallback to load scripts in the DOM if not in a webworker context.
  * Added promise callback to load scripts synchronously.
* **0.1.6**
  * Fixed broken callback chain when not using a worker.
* **0.1.5**
  * Added unique function and deprecated getRandomId.
* **0.1.3-4**
  * Further fleshing out building functions with context.
* **0.1.2**
  * Allow function definition to be built on passed in objects.
* **0.1.2**
  * Updated Readme.
* **0.1.1**
  * Cleaned up the promise interface.
* **0.1.0**
  * Inital creation of application.
