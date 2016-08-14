# Bkgdr (backgrounder)
Simplfies moving javascript code to the background.

### Goals
The key goals of bkgdr.js are to simplify working with web-workers, allow a simple way to switch between using workers and not using workers without changing much else in your code, and finally to provide an understandable api to anyone who is familiar with es6 Promises and asynchronous coding.
One of the main problems in using workers has always been debugging the code in the worker.  Bkgdr is designed to simplify using workers, so that is obviously the point, but to simply debugging, you can run the same code with no changes without using a worker when debugging.

Bkgdr is really designed for a plugin type of usage.  Maybe you have an existing application that needs to do a complicated long running task like resizing an image or hashing files. Instead of trying to make that task work within your application, write a worker plugin (a js file) that does the work.  Call that function from the main thread and you are good to go.  There are lots of other use cases, but Bkgdr is designed for explicitly calling functions rather than unsafe evaluation of javascript strings.  As such, it should be safe to use even in situations where content security policies are in effect (Chrome apps). 

### Install
  * npm (includes d.ts file) `npm install bkgdr`

### Setup
  * With a script tag, add bkgdr.js to your startup page. 
  * Bkgdr is a single js file that will load itself when workers are enabled.  This allows a simple and unified api whether you are calling a function from the worker, or calling into the worker. 
  * To use Bkgdr, you must initialize it by calling `Bkgdr.init(useWorker: boolean, config?: Bkgdr.Config);`
    * The second parameter of initialization is optional, but a must be specified if you are are embedding Bkgdr within another script file, or if you renamed the Bkgdr.js or Bkgdr.min.js file.
  * In the very likely case of needing to use extra libraries, or plugins that you have created:
    * Call `Bkgdr.wi().addScript(scriptLocation).then(.../**promise returns after load*/...);`
    * NOTE: the scriptLocation will be relative to the main worker script (usually the location of your bkgdr.js file).  

### Usage
  * Bkgdr is designed to create a simple, clean and understandable api for dealing with workers.  Once all the setup has been done, whether you are calling from the worker into the main thread or from the main thread to the worker, you would use the same two functions: 
    * `Bkgdr.wi().execute(functionName: string, [params]: any[]);`
    * `Bkgdr.wi().executeWithPromise(functionName: strings, [params]: any[]);`
  * The execute function just calls the namedFunction in the other context with the input parameters.
  * The executeWithPromise function also calls the named function, but returns a promise that will resolve with any returned data from the other context(forwards promises automatically). 
  * NOTE: both input params and returned data from a promise must be Serializable.  This means no cirular references, etc.
  
  
